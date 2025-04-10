const useTranslation = () => ({
  t: (key) => {
    const translations = {
      'common:note': 'Note',
      'common:filterByLanguage': 'Filtrer par langue',
      'common:contentNotAvailable': 'Contenu non disponible',
      // Ajoutez d'autres traductions au besoin
    };
    return translations[key] || key;
  },
  i18n: {
    language: 'fr',
    changeLanguage: () => {},
  },
});

export { useTranslation }; 