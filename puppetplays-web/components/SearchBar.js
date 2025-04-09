import { useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { useTranslation } from 'next-i18next';
import styles from './searchBar.module.scss';

const SearchBar = ({ value = '', onChange = null, onAfterChange = null }) => {
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
    evt => {
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
          <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.23218 1.52502L1.52515 2.23218L3.29297 4L1.52515 5.76782L2.23218 6.47485L4 4.70703L5.76782 6.47485L6.47485 5.7677L4.70703 4L6.47485 2.2323L5.76782 1.52515L4 3.29297L2.23218 1.52502Z"/>
          </svg>
        </button>
      )}
      <div className={styles.submitButton}>
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2812 9.72982C12.0796 8.80455 12.5624 7.59927 12.5624 6.28122C12.5624 3.36448 10.198 1 7.28122 1C4.36448 1 2 3.36448 2 6.28122C2 9.19796 4.36448 11.5624 7.28122 11.5624C8.37142 11.5624 9.38447 11.2321 10.2257 10.6661L13.9708 14.4111L14.9666 13.4153L11.2812 9.72982ZM11.1541 6.28122C11.1541 8.42016 9.42016 10.1541 7.28122 10.1541C5.14228 10.1541 3.40833 8.42016 3.40833 6.28122C3.40833 4.14228 5.14228 2.40833 7.28122 2.40833C9.42016 2.40833 11.1541 4.14228 11.1541 6.28122Z" fill="white" stroke="white" stroke-width="0.5"/>
      </svg>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  onAfterChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default SearchBar;