import { useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import useTranslation from 'next-translate/useTranslation';
import SearchIcon from './icon-search.svg';
import CrossIcon from './icon-cross.svg';
import styles from './searchBar.module.scss';

const SearchBar = ({ value, onChange, onAfterChange }) => {
  const { t } = useTranslation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceOnChange = useCallback(
    debounce(onAfterChange, 500, {
      leading: false,
      trailing: true,
    }),
    [onAfterChange],
  );

  const handleChange = useCallback(
    (evt) => {
      debounceOnChange(evt.target.value);
      onChange(evt.target.value);
    },
    [onChange, debounceOnChange],
  );

  const handleReset = useCallback(() => {
    debounceOnChange('');
    onChange('');
  }, [onChange, debounceOnChange]);

  return (
    <div className={styles.container}>
      <input
        name="search"
        placeholder={t('common:searchPlaceholder')}
        type="text"
        value={value}
        onChange={handleChange}
      />
      {value && (
        <button
          type="button"
          onClick={handleReset}
          className={styles.resetButton}
        >
          <CrossIcon />
        </button>
      )}
      <div className={styles.submitButton}>
        <SearchIcon />
      </div>
    </div>
  );
};

SearchBar.defaultProps = {
  value: '',
};

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  onAfterChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default SearchBar;
