import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import SearchIcon from './icon-search.svg';
import CrossIcon from './icon-cross.svg';
import styles from './searchBar.module.scss';

const SearchBarStateful = () => {
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();
  const router = useRouter();

  const handleReset = useCallback(() => {
    setSearchValue('');
  }, [setSearchValue]);

  const handleSearchChange = useCallback(
    evt => {
      setSearchValue(evt.target.value);
    },
    [setSearchValue],
  );

  const handleSubmit = useCallback(
    evt => {
      evt.preventDefault();
      router.push(
        `/base-de-donnees/?search=${evt.target.elements.search.value}`,
      );
    },
    [router],
  );

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input
        name="search"
        placeholder={t('common:searchPlaceholder')}
        type="text"
        value={searchValue}
        onChange={handleSearchChange}
      />
      {searchValue && (
        <button
          type="button"
          onClick={handleReset}
          className={styles.resetButton}
        >
          <CrossIcon />
        </button>
      )}
      <button type="submit" className={styles.submitButton}>
        <SearchIcon />
      </button>
    </form>
  );
};

export default SearchBarStateful;
