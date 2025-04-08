import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
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
          <Image src="/icon-cross.svg" alt="" width={15} height={15} />
        </button>
      )}
      <button type="submit" className={styles.submitButton}>
        <Image src="/icon-search.svg" alt="" width={20} height={20} />
      </button>
    </form>
  );
};

export default SearchBarStateful;
