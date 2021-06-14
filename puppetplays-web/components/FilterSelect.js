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
  onChange,
}) {
  const { t } = useTranslation();

  return (
    <div>
      <FilterLabel htmlFor={name}>{t(`common:filters.${name}`)}</FilterLabel>
      <Select
        className="filter-select"
        classNamePrefix="select"
        theme={getTheme}
        styles={styles}
        inputId={`select-input-of-${name}`}
        components={components}
        name={name}
        placeholder={placeholder}
        getOptionLabel={get('title')}
        getOptionValue={get('id')}
        value={isMulti && isNil(value) ? [] : value}
        options={options}
        onChange={onChange}
        isClearable={!isMulti}
        isMulti={isMulti}
      />
    </div>
  );
}

FilterSelect.defaultProps = {
  value: null,
  placeholder: '',
  options: null,
  isMulti: true,
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
};

export default FilterSelect;
