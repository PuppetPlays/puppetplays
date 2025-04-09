import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import FilterLabel from 'components/FilterLabel';
import styles from './filterCheckbox.module.scss';

function FilterCheckbox({ name = null, checked = false, onChange = null }) {
  const { t } = useTranslation();

  const handeChange = useCallback(
    evt => {
      onChange(evt.target.checked, { name });
    },
    [name, onChange],
  );

  return (
    <div className={styles.container}>
      <input
        aria-labelledby={`aria-label-of-${name}`}
        name={name}
        type="checkbox"
        onChange={handeChange}
        value={name}
        checked={checked}
        className={styles.checkbox}
      />
      <FilterLabel id={`aria-label-of-${name}`} htmlFor={name}>
        {t(`common:filters.${name}`)}
      </FilterLabel>
    </div>
  );
}

FilterCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
};

export default FilterCheckbox;
