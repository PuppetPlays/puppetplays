import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import styles from './searchBar.module.scss';

const SearchBar = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchTerms, setSearchTerms] = useState(router.query.search || '');

  const updateQuery = useCallback(
    (search) => {
      router.push(`/?search=${search}`, undefined, { shallow: true });
    },
    [router],
  );

  const debounceOnChange = useCallback(
    debounce(updateQuery, 500, {
      leading: false,
      trailing: true,
    }),
    [updateQuery],
  );

  const handleChange = useCallback((evt) => {
    setSearchTerms(evt.target.value);
    debounceOnChange(evt.target.value);
  });

  useEffect(() => {
    if (router.query && router.query.search) {
      setSearchTerms(router.query.search);
    } else {
      setSearchTerms('');
    }
  }, [router.query, setSearchTerms]);

  return (
    <div className={styles.container}>
      <input
        placeholder={t('common:searchPlaceholder')}
        type="text"
        value={searchTerms}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
