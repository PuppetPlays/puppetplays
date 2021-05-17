import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Select from 'react-select';
import get from 'lodash/fp/get';
import FilterLabel from 'components/FilterLabel';
import { styles, components, getTheme } from './filterSelectStyles';

function FilterSelect({ name, placeholder, value, options, onChange }) {
  const { t } = useTranslation();

  return (
    <div>
      <FilterLabel htmlFor={name}>{t(`common:${name}`)}</FilterLabel>
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
        value={value}
        options={options}
        onChange={onChange}
        isClearable={false}
        isMulti
      />
    </div>
  );
}

FilterSelect.defaultProps = {
  value: null,
  placeholder: '',
  options: [],
};

FilterSelect.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.arrayOf(PropTypes.object),
};

export default FilterSelect;
