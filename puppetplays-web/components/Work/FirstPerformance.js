import useTranslation from 'next-translate/useTranslation';
import { hasAtLeastOneItem } from 'lib/utils';
import Section from 'components/Section';
import Place from 'components/Place';

function FirstPerformance({ place, date, extraInfo }) {
  const { t } = useTranslation();

  return (
    <Section
      title={t('common:firstPerformance')}
      show={hasAtLeastOneItem(place) || date || extraInfo}
    >
      {hasAtLeastOneItem(place) && <Place {...place[0]} />}
      {date && <span>, {date}</span>}
      {extraInfo && <span> - {extraInfo}</span>}
    </Section>
  );
}

export default FirstPerformance;
