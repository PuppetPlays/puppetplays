#!/bin/bash

# Script pour vérifier les traductions manquantes
# Usage: ./check-translations.sh

set -e

# Configuration
BASE_URL="https://puppetplays.eu"
LOGS_DIR="translation-check-logs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="translation-report-${TIMESTAMP}.txt"

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Créer le répertoire de logs
mkdir -p "$LOGS_DIR"

echo -e "${BLUE}=== Puppetplays Translation Check ===${NC}"
echo -e "${BLUE}Timestamp: ${TIMESTAMP}${NC}"
echo ""

# Extraire les URLs du sitemap
echo -e "${YELLOW}Extraction des URLs du sitemap...${NC}"
URLS=$(curl -s "${BASE_URL}/sitemap-0.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<[^>]*>//g')

# Compter le nombre d'URLs
URL_COUNT=$(echo "$URLS" | wc -l)
echo -e "${GREEN}Trouvé ${URL_COUNT} URLs à vérifier${NC}"
echo ""

# Initialiser le rapport
echo "=== Translation Check Report ===" > "$REPORT_FILE"
echo "Generated: $(date)" >> "$REPORT_FILE"
echo "Total URLs: $URL_COUNT" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Variables pour les statistiques
SUCCESS_COUNT=0
ERROR_COUNT=0
MISSING_TRANSLATIONS=()

# Fonction pour nettoyer le nom de fichier
clean_filename() {
    echo "$1" | sed 's|https://||g' | sed 's|/|_|g' | sed 's|:|_|g'
}

# Fonction pour analyser les erreurs de traduction dans la réponse
check_translation_errors() {
    local content="$1"
    local url="$2"
    local errors=""
    
    # Patterns communs d'erreurs de traduction
    if echo "$content" | grep -q "Missing translation"; then
        errors="${errors}Missing translation detected\n"
    fi
    
    if echo "$content" | grep -q "translation key"; then
        errors="${errors}Translation key issues detected\n"
    fi
    
    # Chercher des clés de traduction non résolues (format: common.key ou project.key)
    local unresolved_keys=$(echo "$content" | grep -oE '[a-zA-Z]+\.[a-zA-Z]+(\.[a-zA-Z]+)*' | grep -E '^(common|project|home|team|privacy|accessibility|anthology)\.' | sort | uniq)
    if [ ! -z "$unresolved_keys" ]; then
        errors="${errors}Unresolved translation keys found:\n${unresolved_keys}\n"
    fi
    
    echo "$errors"
}

# Parcourir chaque URL
CURRENT=0
for URL in $URLS; do
    CURRENT=$((CURRENT + 1))
    echo -e "${BLUE}[$CURRENT/$URL_COUNT] Vérification: $URL${NC}"
    
    # Créer un nom de fichier sûr pour le log
    LOG_FILE="${LOGS_DIR}/$(clean_filename "$URL").log"
    
    # Faire la requête avec curl
    HTTP_CODE=$(curl -s -o "$LOG_FILE" -w "%{http_code}" \
        -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
        -H "Accept-Language: fr-FR,fr;q=0.9,en;q=0.8" \
        -H "User-Agent: Mozilla/5.0 (Translation Checker Bot)" \
        "$URL")
    
    # Vérifier le code de retour HTTP
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo -e "${GREEN}  ✓ HTTP $HTTP_CODE - Success${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        
        # Analyser le contenu pour les erreurs de traduction
        CONTENT=$(cat "$LOG_FILE")
        ERRORS=$(check_translation_errors "$CONTENT" "$URL")
        
        if [ ! -z "$ERRORS" ]; then
            echo -e "${RED}  ⚠ Translation issues found:${NC}"
            echo "$ERRORS" | sed 's/^/    /'
            MISSING_TRANSLATIONS+=("$URL")
            
            # Ajouter au rapport
            echo "URL: $URL" >> "$REPORT_FILE"
            echo "Issues:" >> "$REPORT_FILE"
            echo "$ERRORS" >> "$REPORT_FILE"
            echo "---" >> "$REPORT_FILE"
        fi
    else
        echo -e "${RED}  ✗ HTTP $HTTP_CODE - Error${NC}"
        ERROR_COUNT=$((ERROR_COUNT + 1))
        
        # Ajouter l'erreur au rapport
        echo "URL: $URL" >> "$REPORT_FILE"
        echo "HTTP Error: $HTTP_CODE" >> "$REPORT_FILE"
        echo "---" >> "$REPORT_FILE"
    fi
    
    # Pause courte pour ne pas surcharger le serveur
    sleep 0.5
done

echo ""
echo -e "${BLUE}=== Résumé ===${NC}"
echo -e "${GREEN}Succès: $SUCCESS_COUNT${NC}"
echo -e "${RED}Erreurs: $ERROR_COUNT${NC}"
echo -e "${YELLOW}Pages avec problèmes de traduction: ${#MISSING_TRANSLATIONS[@]}${NC}"

# Ajouter le résumé au rapport
echo "" >> "$REPORT_FILE"
echo "=== Summary ===" >> "$REPORT_FILE"
echo "Success: $SUCCESS_COUNT" >> "$REPORT_FILE"
echo "Errors: $ERROR_COUNT" >> "$REPORT_FILE"
echo "Pages with translation issues: ${#MISSING_TRANSLATIONS[@]}" >> "$REPORT_FILE"

if [ ${#MISSING_TRANSLATIONS[@]} -gt 0 ]; then
    echo "" >> "$REPORT_FILE"
    echo "Pages with translation issues:" >> "$REPORT_FILE"
    for url in "${MISSING_TRANSLATIONS[@]}"; do
        echo "  - $url" >> "$REPORT_FILE"
    done
fi

echo ""
echo -e "${GREEN}Rapport sauvegardé dans: $REPORT_FILE${NC}"
echo -e "${GREEN}Logs individuels dans: $LOGS_DIR/${NC}"

# Créer un script d'analyse détaillée
cat > analyze-translations.sh << 'EOF'
#!/bin/bash

# Script pour analyser les logs de traduction en détail
LOGS_DIR="translation-check-logs"

echo "=== Analyse détaillée des traductions manquantes ==="
echo ""

# Chercher tous les patterns de traduction non résolus
echo "Clés de traduction non résolues trouvées:"
grep -h -oE '[a-zA-Z]+\.[a-zA-Z]+(\.[a-zA-Z]+)*' $LOGS_DIR/*.log | \
    grep -E '^(common|project|home|team|privacy|accessibility|anthology)\.' | \
    sort | uniq -c | sort -nr

echo ""
echo "Pour analyser un log spécifique:"
echo "  cat $LOGS_DIR/<filename>.log | less"
EOF

chmod +x analyze-translations.sh

echo ""
echo -e "${BLUE}Script d'analyse créé: ./analyze-translations.sh${NC}" 