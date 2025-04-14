const useTranslation = () => {
  return {
    t: (key) => key,
    i18n: {
      language: 'fr',
      changeLanguage: jest.fn()
    }
  };
};

module.exports = {
  useTranslation,
  i18n: {
    language: 'fr',
    changeLanguage: jest.fn()
  }
}; 