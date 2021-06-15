import { useCallback } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import SearchIcon from './icon-search.svg';
import styles from './searchBar.module.scss';

const SearchBarStateful = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      router.push(`/repertoire/?search=${evt.target.elements.search.value}`);
    },
    [router],
  );

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input
        name="search"
        placeholder={t('common:searchPlaceholder')}
        type="text"
        defaultValue=""
      />
      <button type="submit" className={styles.submitButton}>
        <SearchIcon />
      </button>
    </form>
  );
};

export default SearchBarStateful;
