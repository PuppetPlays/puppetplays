import FilterLabel from 'components/FilterLabel';
import get from 'lodash/fp/get';
import isNil from 'lodash/isNil';
import noop from 'lodash/noop';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useCallback, useState, useEffect } from 'react';
import Select from 'react-select';

import { styles, components, getTheme } from './filterSelectStyles';

function FilterSelect({
  name,
  placeholder = '',
  value = null,
  options = [],
  isMulti = true,
  isClearable = true,
  isSearchable = true,
  onChange,
  onFocus = noop,
  inverse = true,
  isDisabled = false,
  label,
}) {
  // État pour suivre si le composant est monté (côté client)
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation();

  // Effet pour marquer le composant comme monté après le rendu initial
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getNoOptionsMessage = useCallback(
    ({ inputValue }) => {
      if (inputValue) {
        return t('common:filters.noOptions');
      }
      return '…';
    },
    [t],
  );

  return (
    <div>
      <FilterLabel
        id={`aria-label-of-${name}`}
        htmlFor={`select-input-of-${name}`}
      >
        {label ?? t(`common:filters.${name}`)}
      </FilterLabel>

      {/* Ne rendre le Select que côté client */}
      {isMounted ? (
        <Select
          aria-labelledby={`aria-label-of-${name}`}
          className="filter-select"
          classNamePrefix="select"
          theme={getTheme}
          styles={styles}
          instanceId={`select-id-${name}`}
          inputId={`select-input-of-${name}`}
          components={components}
          name={name}
          placeholder={placeholder}
          getOptionLabel={get('title')}
          getOptionValue={get('id')}
          value={isMulti && isNil(value) ? [] : value}
          options={options}
          onChange={onChange}
          onFocus={onFocus}
          isClearable={!isMulti && isClearable}
          isSearchable={isSearchable}
          isMulti={isMulti}
          inverse={inverse}
          isDisabled={isDisabled}
          noOptionsMessage={getNoOptionsMessage}
        />
      ) : (
        // Emplacement réservé pendant le rendu côté serveur
        <div className="filter-select-placeholder" />
      )}
    </div>
  );
}

FilterSelect.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.object,
  ]),
  options: PropTypes.arrayOf(PropTypes.object),
  isMulti: PropTypes.bool,
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  inverse: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
};

export default FilterSelect;
