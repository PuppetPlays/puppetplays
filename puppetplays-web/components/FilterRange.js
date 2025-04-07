import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import ReactSlider from 'react-slider';
import FilterLabel from 'components/FilterLabel';
import styles from './filterRange.module.scss';

const renderThumb = props => {
  return <div {...props} />;
};

function FilterRange({ name, valueMin, valueMax, bounds, onAfterChange }) {
  const { t } = useTranslation();
  const sliderRef = useRef(null);
  const [values, setValues] = useState([
    valueMin || bounds[0],
    valueMax || bounds[1],
  ]);

  const handeAfterChange = useCallback(
    value => {
      onAfterChange(value, { name });
    },
    [name, onAfterChange],
  );

  const handeChange = useCallback(
    value => {
      setValues(value);
    },
    [setValues],
  );

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.resize();
    }
  }, [sliderRef]);

  useEffect(() => {
    setValues([valueMin || bounds[0], valueMax || bounds[1]]);
  }, [valueMin, valueMax, bounds]);

  return (
    <div className={styles.wrapper}>
      <FilterLabel id={`aria-label-of-${name}`} htmlFor={name}>
        {t(`common:filters.${name}`)}
      </FilterLabel>
      {bounds && (
        <Fragment>
          <ReactSlider
            ref={sliderRef}
            className={styles.container}
            thumbClassName={styles.thumb}
            trackClassName={styles.track}
            value={[valueMin || bounds[0], valueMax || bounds[1]]}
            min={bounds[0]}
            max={bounds[1]}
            ariaLabel={[
              t('common:filters.lowerBoundPeriod'),
              t('common:filters.upperBoundPeriod'),
            ]}
            ariaValuetext={state =>
              t('common:filters.selectedPeriod', { count: state.valueNow })
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
                {t('common:filters.composeAfter')}
              </div>
              <div>{values[0]}</div>
            </div>
            <div className={styles.separator}>–</div>
            <div className={styles.value}>
              <div className={styles.valueLabel}>
                {t('common:filters.composeBefore')}
              </div>
              <div>{values[1]}</div>
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
