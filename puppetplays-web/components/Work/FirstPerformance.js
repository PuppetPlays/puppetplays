import Place from 'components/Place';
import Section from 'components/Section';
import { hasAtLeastOneItem } from 'lib/utils';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';

import styles from './firstPerformance.module.scss';

function FirstPerformance({ place = [], date = null, extraInfo = null }) {
  const { t } = useTranslation();
  const hasOnePlace = hasAtLeastOneItem(place);

  return (
    <Section
      title={t('common:firstPerformance')}
      show={!!(hasOnePlace || date || extraInfo)}
    >
      {hasOnePlace && <Place {...place[0]} />}
      {hasOnePlace && (date || extraInfo) && ', '}
      {date && date}
      {date && extraInfo && ' - '}
      {extraInfo && (
        <div
          className={styles.extraInfo}
          dangerouslySetInnerHTML={{ __html: extraInfo }}
        />
      )}
    </Section>
  );
}

FirstPerformance.propTypes = {
  place: PropTypes.arrayOf(PropTypes.object),
  date: PropTypes.string,
  extraInfo: PropTypes.string,
};

export default FirstPerformance;
