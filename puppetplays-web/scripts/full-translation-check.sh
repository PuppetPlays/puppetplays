#!/bin/bash

# Script complet pour vérifier les traductions
# Combine l'audit du code source et le test des pages en production

set -e

# Couleurs
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== Vérification complète des traductions Puppetplays ===${NC}"
echo -e "${BLUE}$(date)${NC}\n"

# Répertoire des scripts
SCRIPTS_DIR="$(dirname "$0")"

# 1. Audit du code source
echo -e "${YELLOW}Étape 1: Audit du code source${NC}"
echo -e "${YELLOW}Analyse des clés de traduction utilisées vs définies...${NC}\n"

if [ -f "$SCRIPTS_DIR/audit-translations.js" ]; then
    node "$SCRIPTS_DIR/audit-translations.js"
else
    echo -e "${RED}Erreur: audit-translations.js non trouvé${NC}"
    exit 1
fi

echo -e "\n${GREEN}✓ Audit du code source terminé${NC}\n"

# 2. Test des pages en production (optionnel)
echo -e "${YELLOW}Étape 2: Test des pages en production${NC}"
echo -e "${YELLOW}Voulez-vous tester les pages en production? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo -e "\n${YELLOW}Lancement du test des pages...${NC}\n"
    
    if [ -f "$SCRIPTS_DIR/check-translations.sh" ]; then
        bash "$SCRIPTS_DIR/check-translations.sh"
    else
        echo -e "${RED}Erreur: check-translations.sh non trouvé${NC}"
        exit 1
    fi
else
    echo -e "${BLUE}Test des pages en production ignoré${NC}"
fi

# 3. Générer un résumé
echo -e "\n${BLUE}=== Résumé ===${NC}"
echo -e "${GREEN}Les rapports suivants ont été générés:${NC}"

# Lister les rapports générés
if ls translation-audit-*.json 1> /dev/null 2>&1; then
    echo -e "${GREEN}  - Rapport d'audit du code: $(ls -t translation-audit-*.json | head -1)${NC}"
fi

if ls translation-report-*.txt 1> /dev/null 2>&1; then
    echo -e "${GREEN}  - Rapport de test des pages: $(ls -t translation-report-*.txt | head -1)${NC}"
fi

if [ -d "translation-check-logs" ]; then
    echo -e "${GREEN}  - Logs des pages: translation-check-logs/${NC}"
fi

echo -e "\n${BLUE}=== Prochaines étapes ===${NC}"
echo -e "1. Examinez les rapports générés pour identifier les traductions manquantes"
echo -e "2. Ajoutez les traductions manquantes dans les fichiers public/locales/[fr|en]/*.json"
echo -e "3. Assurez-vous que les clés sont cohérentes entre FR et EN"
echo -e "4. Supprimez les clés non utilisées pour garder les fichiers propres"

echo -e "\n${GREEN}✅ Vérification complète terminée!${NC}\n" 