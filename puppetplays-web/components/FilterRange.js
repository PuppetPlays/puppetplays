import { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import ReactSlider from 'react-slider';
import FilterLabel from 'components/FilterLabel';
import styles from './filterRange.module.scss';

const renderThumb = (props) => {
  return <div {...props} />;
};

function FilterRange({ name, valueMin, valueMax, bounds, onAfterChange }) {
  const { t } = useTranslation();
  const [values, setValues] = useState([valueMin, valueMax]);

  const handeAfterChange = useCallback(
    (value) => {
      onAfterChange(value, { name });
    },
    [name, onAfterChange],
  );

  const handeChange = useCallback(
    (value) => {
      setValues(value);
    },
    [setValues],
  );

  useEffect(() => {
    setValues([valueMin, valueMax]);
  }, [valueMin, valueMax]);

  return (
    <div>
      <FilterLabel htmlFor={name}>{t(`common:${name}`)}</FilterLabel>
      {bounds && (
        <Fragment>
          <ReactSlider
            className={styles.container}
            thumbClassName={styles.thumb}
            trackClassName={styles.track}
            value={[valueMin || bounds[0], valueMax || bounds[1]]}
            min={bounds[0]}
            max={bounds[1]}
            ariaLabel={[
              t('common:lowerBoundPeriod'),
              t('common:upperBoundPeriod'),
            ]}
            ariaValuetext={(state) =>
              t('common:selectedPeriod', { count: state.valueNow })
            }
            renderThumb={renderThumb}
            pearling
            minDistance={1}
            onAfterChange={handeAfterChange}
            onChange={handeChange}
          />
          <div className={styles.valuesContainer}>
            <div className={styles.value}>
              <div className={styles.valueLabel}>
                {t('common:composeAfter')}
              </div>
              <div>{values[0] || '–'}</div>
            </div>
            <div className={styles.separator}>–</div>
            <div className={styles.value}>
              <div className={styles.valueLabel}>
                {t('common:composeBefore')}
              </div>
              <div>{values[1] || '–'}</div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}

FilterRange.defaultProps = {
  valueMin: null,
  valueMax: null,
  bounds: null,
};

FilterRange.propTypes = {
  name: PropTypes.string.isRequired,
  onAfterChange: PropTypes.func.isRequired,
  valueMin: PropTypes.number,
  valueMax: PropTypes.number,
  bounds: PropTypes.arrayOf(PropTypes.number),
};

export default FilterRange;
