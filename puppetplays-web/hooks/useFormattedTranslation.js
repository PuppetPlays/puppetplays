import { formatPuppetPlays } from 'lib/utils';
import { useTranslation } from 'next-i18next';

export const useFormattedTranslation = namespaces => {
  const { t, ...rest } = useTranslation(namespaces);

  const formatT = (key, options) => {
    const translatedText = t(key, options);
    return formatPuppetPlays(translatedText);
  };

  return { t: formatT, ...rest };
};
