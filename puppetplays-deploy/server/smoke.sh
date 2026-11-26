#!/usr/bin/env bash
# Read-only. Requests the site through the local nginx with TLS verification,
# the way an outside visitor would once traffic reaches the VM.
set -u
# Public IP from DNS, so the request takes the same path as a visitor's.
ip=$(getent hosts puppetplays.eu | awk '{print $1}')
body=$(mktemp)
ok=1
check() {
  local name=$1 host=$2 path=$3; shift 3
  local got
  got=$(curl -s -o "$body" -w '%{http_code}' --max-time 60 --resolve "$host:443:$ip" "$@" "https://$host$path") || got=ERR
  printf '  %-26s %s\n' "$name" "$got"
  [ "$got" = 200 ] || ok=0
}
check "web /"                puppetplays.eu /
check "web /base-de-donnees" puppetplays.eu /base-de-donnees
check "web /auteurs"         puppetplays.eu /auteurs
check "admin /login"         admin.puppetplays.eu /login
check "api /graphql"         api.puppetplays.eu /graphql -H 'Content-Type: application/json' \
  -d '{"query":"{ entryCount(section:\"works\") }"}'
count=$(grep -oE '"entryCount":[0-9]+' "$body" | cut -d: -f2)
printf '  %-26s %s\n' "works in API" "${count:-none}"
[ "${count:-0}" -gt 0 ] || ok=0
unlink "$body"
[ $ok = 1 ] && echo "SMOKE OK" || { echo "SMOKE FAILED"; exit 1; }
