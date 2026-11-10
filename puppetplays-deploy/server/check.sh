#!/usr/bin/env bash
# Read-only. Wider check than smoke.sh: certificates, redirects, assets, CORS
# for browser calls to the API and outbound access from the web container.
# Requests go to the public IP with TLS verification on.
set -u
ip=$(getent hosts puppetplays.eu | awk '{print $1}')
tmp=$(mktemp -d)
fail=0
row() { printf '  %-40s %s\n' "$1" "$2"; }
req() { # name expected url [curl args...]
  local name=$1 want=$2 url=$3; shift 3
  local host port=443 got
  host=$(echo "$url" | sed -E 's#^https?://([^/]+).*#\1#')
  [[ $url == http://* ]] && port=80
  got=$(curl -s -o "$tmp/body" -D "$tmp/head" -w '%{http_code} %{redirect_url}' --max-time 60 \
        --resolve "$host:$port:$ip" "$@" "$url" 2>"$tmp/err") || got="ERR $(head -c 100 "$tmp/err")"
  row "$name" "$got"
  [[ $got == "$want"* ]] || { fail=1; row "" "^ expected $want"; }
}

echo "== certificate"
end=$(echo | openssl s_client -connect "$ip:443" -servername puppetplays.eu 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
days=$(( ( $(date -d "$end" +%s) - $(date +%s) ) / 86400 ))
row "puppetplays.eu (+admin, api)" "expires $end ($days days)"
[ "$days" -gt 20 ] || { fail=1; row "" "^ renews only if port 80 is reachable from outside"; }

echo "== pages"
req "http://puppetplays.eu/"          301 http://puppetplays.eu/
req "https://puppetplays.eu/"         200 https://puppetplays.eu/
req "https://puppetplays.eu/en"       200 https://puppetplays.eu/en
req "https://puppetplays.eu/oeuvres"  200 https://puppetplays.eu/base-de-donnees
req "https://admin.puppetplays.eu/login" 200 https://admin.puppetplays.eu/login

echo "== assets"
chunk=$(curl -s --max-time 60 --resolve "puppetplays.eu:443:$ip" https://puppetplays.eu/ | grep -oE '/_next/static/[^"]+\.js' | head -1)
req "next.js chunk" 200 "https://puppetplays.eu$chunk"
asset=$(curl -s --max-time 60 --resolve "api.puppetplays.eu:443:$ip" -H 'Content-Type: application/json' \
  -d '{"query":"{ assets(limit:1, kind:\"image\") { url } }"}' https://api.puppetplays.eu/graphql \
  | grep -oE 'https?:[^"]+' | head -1 | sed 's#\\/#/#g')
[ -n "$asset" ] && req "craft image" 200 "$asset" || { fail=1; row "craft image" "no asset url"; }

echo "== API from the browser (CORS)"
req "OPTIONS /graphql" 200 https://api.puppetplays.eu/graphql -X OPTIONS \
  -H 'Origin: https://puppetplays.eu' -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type'
grep -qi '^access-control-allow-origin' "$tmp/head" || { fail=1; row "" "^ no Access-Control-Allow-Origin"; }

echo "== outbound from the web container"
for u in "https://api.nakala.fr/collections/10.34847/nkl.ff0dmvni" "https://api.archives-ouvertes.fr/search/?q=puppet&rows=0"; do
  code=$(docker exec puppetplays-web node -e "fetch('$u').then(r=>console.log(r.status)).catch(e=>console.log('ERR '+(e.cause?.code||e.message)))" 2>&1)
  row "${u:8:36}" "$code"
  [ "$code" = 200 ] || fail=1
done

echo "== known gaps (not checked as failures)"
row "www.puppetplays.eu" "no nginx server block and not in the certificate"

rm -r "$tmp"
[ $fail = 0 ] && echo "CHECK OK" || { echo "CHECK FAILED"; exit 1; }
