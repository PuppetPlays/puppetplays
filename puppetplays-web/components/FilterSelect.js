import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Select from 'react-select';
import get from 'lodash/fp/get';
import isNil from 'lodash/isNil';
import FilterLabel from 'components/FilterLabel';
import { styles, components, getTheme } from './filterSelectStyles';

function FilterSelect({
  name,
  placeholder,
  value,
  options,
  isMulti,
  isClearable,
  isSearchable,
  onChange,
  inverse,
  isDisabled,
}) {
  const { t } = useTranslation();

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
        isClearable={!isMulti && isClearable}
        isSearchable={isSearchable}
        isMulti={isMulti}
        inverse={inverse}
        isDisabled={isDisabled}
      />
    </div>
  );
}

FilterSelect.defaultProps = {
  value: null,
  placeholder: '',
  options: null,
  isMulti: true,
  isClearable: true,
  isSearchable: true,
  inverse: true,
  isDisabled: false,
};

FilterSelect.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
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
