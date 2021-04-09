import useTranslation from 'next-translate/useTranslation';
import { hasAtLeastOneItem } from 'lib/utils';
import Section from 'components/Section';
import Place from 'components/Place';

function FirstPerformance({ place, date, extraInfo }) {
  const { t } = useTranslation();
  const hasOnePlace = hasAtLeastOneItem(place);

  return (
    <Section
      title={t('common:firstPerformance')}
      show={!!(hasOnePlace || date || extraInfo)}
    >
      {hasOnePlace && <Place {...place[0]} />}
      {hasOnePlace && ', '}
      {date && date}
      {date && extraInfo && ' - '}
      {extraInfo && extraInfo}
    </Section>
  );
}

export default FirstPerformance;
