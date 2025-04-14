import FilterLabel from 'components/FilterLabel';
import get from 'lodash/fp/get';
import isNil from 'lodash/isNil';
import noop from 'lodash/noop';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
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
}) {
  const { t } = useTranslation();
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
        {t(`common:filters.${name}`)}
      </FilterLabel>
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
};

export default FilterSelect;
