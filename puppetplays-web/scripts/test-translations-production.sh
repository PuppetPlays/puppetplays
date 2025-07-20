#!/bin/bash

# Script pour tester les traductions sur quelques pages en local
# Démarre le serveur dev et teste quelques URLs

echo "=== Test des traductions en local ==="
echo ""

# Vérifier si le serveur est déjà en cours d'exécution
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Le serveur est déjà en cours d'exécution sur le port 3000"
    SERVER_ALREADY_RUNNING=true
else
    echo "Démarrage du serveur de développement..."
    npm run dev &
    SERVER_PID=$!
    echo "PID du serveur: $SERVER_PID"
    
    # Attendre que le serveur démarre
    echo "Attente du démarrage du serveur..."
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null; then
            echo "✅ Serveur démarré"
            break
        fi
        sleep 1
    done
fi

# URLs à tester
URLS=(
    "http://localhost:3000/"
    "http://localhost:3000/en"
    "http://localhost:3000/techniques-d-animation"
    "http://localhost:3000/en/techniques-d-animation"
    "http://localhost:3000/auteurs"
    "http://localhost:3000/en/auteurs"
    "http://localhost:3000/anthologie"
    "http://localhost:3000/en/anthologie"
    "http://localhost:3000/base-de-donnees"
    "http://localhost:3000/en/base-de-donnees"
)

# Créer un répertoire pour les logs
mkdir -p local-translation-test-logs

echo ""
echo "Test des pages..."
echo ""

# Tester chaque URL
for URL in "${URLS[@]}"; do
    echo -n "Test de $URL ... "
    
    # Créer un nom de fichier sûr
    LOG_FILE="local-translation-test-logs/$(echo "$URL" | sed 's|http://localhost:3000||g' | sed 's|/|_|g' | sed 's|^_||').html"
    
    # Récupérer la page
    HTTP_CODE=$(curl -s -o "$LOG_FILE" -w "%{http_code}" "$URL")
    
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo "✅ OK"
        
        # Chercher des erreurs de traduction communes
        if grep -q "Missing translation" "$LOG_FILE"; then
            echo "  ⚠️  Traductions manquantes détectées"
        fi
        
        # Chercher des clés non résolues
        UNRESOLVED=$(grep -oE '[a-zA-Z]+:[a-zA-Z]+(\.[a-zA-Z]+)*' "$LOG_FILE" | grep -E '^(common|project|home|team|privacy|accessibility|anthology):' | sort | uniq)
        if [ ! -z "$UNRESOLVED" ]; then
            echo "  ⚠️  Clés non résolues:"
            echo "$UNRESOLVED" | sed 's/^/    /'
        fi
    else
        echo "❌ Erreur HTTP $HTTP_CODE"
    fi
done

# Arrêter le serveur si on l'a démarré
if [ -z "$SERVER_ALREADY_RUNNING" ] && [ ! -z "$SERVER_PID" ]; then
    echo ""
    echo "Arrêt du serveur..."
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
fi

echo ""
echo "✅ Test terminé. Logs sauvegardés dans local-translation-test-logs/"
echo ""
echo "Pour analyser les résultats:"
echo "  grep -h '[a-zA-Z]+:[a-zA-Z]+' local-translation-test-logs/*.html | grep -E '^(common|project|home|team|privacy|accessibility|anthology):' | sort | uniq -c" 