import { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import * as Slider from '@radix-ui/react-slider';
import FilterLabel from 'components/FilterLabel';
import styles from './filterRange.module.scss';

function FilterRange({ name = null, valueMin = null, valueMax = null, bounds = null, onAfterChange = null }) {
  const { t } = useTranslation();
  const [values, setValues] = useState([
    valueMin || bounds[0],
    valueMax || bounds[1],
  ]);

  const handleChange = useCallback(
    value => {
      setValues(value);
      onAfterChange(value, { name });
    },
    [name, onAfterChange],
  );

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
          <Slider.Root
            className={styles.container}
            value={[valueMin || bounds[0], valueMax || bounds[1]]}
            min={bounds[0]}
            max={bounds[1]}
            step={1}
            minStepsBetweenThumbs={1}
            onValueChange={handleChange}
            aria-label={t('common:filters.periodRange')}
          >
            <Slider.Track className={styles.track}>
              <Slider.Range className={styles.range} />
            </Slider.Track>
            <Slider.Thumb
              className={styles.thumb}
              aria-label={t('common:filters.lowerBoundPeriod')}
            />
            <Slider.Thumb
              className={styles.thumb}
              aria-label={t('common:filters.upperBoundPeriod')}
            />
          </Slider.Root>
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


FilterRange.propTypes = {
  name: PropTypes.string.isRequired,
  onAfterChange: PropTypes.func.isRequired,
  valueMin: PropTypes.number,
  valueMax: PropTypes.number,
  bounds: PropTypes.arrayOf(PropTypes.number),
};

export default FilterRange;
