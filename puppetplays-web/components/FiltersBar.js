import { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import useTranslation from 'next-translate/useTranslation';
import useWindowSize from 'hooks/useWindowSize';
import styles from './filtersBar.module.scss';

function FiltersBar({ cookieName, children, filtersCount, onClearAll }) {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const [cookies, setCookie] = useCookies();
  const isOpen = cookies[cookieName] === 'false' ? false : true;

  const handleToggleFiltersBar = () => {
    setCookie(cookieName, !isOpen, { path: '/', sameSite: 'Lax' });
  };

  useEffect(() => {
    if (width < 900) {
      setCookie(cookieName, false, { path: '/', sameSite: 'Lax' });
    }
  }, [width, cookieName, setCookie]);

  return (
    <div
      className={`${styles.container} ${
        isOpen ? styles.isOpen : ''
      } filters-bar`}
    >
      <header className={styles.header}>
        {isOpen && (
          <h1 className={styles.title}>{t('common:filters.title')}</h1>
        )}
        <div className={styles.icon}>
          <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.33681 8L0 8V6L9.03544 6C9.27806 4.30385 10.7368 3 12.5 3C14.2632 3 15.7219 4.30385 15.9646 6L20 6V8L15.6632 8C15.1015 9.18247 13.8962 10 12.5 10C11.1038 10 9.89855 9.18247 9.33681 8ZM11 6.5C11 5.67157 11.6716 5 12.5 5C13.3284 5 14 5.67157 14 6.5C14 7.32843 13.3284 8 12.5 8C11.6716 8 11 7.32843 11 6.5ZM0 14H4.03544C4.27806 15.6961 5.73676 17 7.5 17C9.26324 17 10.7219 15.6961 10.9646 14H20V12H10.6632C10.1015 10.8175 8.8962 10 7.5 10C6.1038 10 4.89855 10.8175 4.33682 12H0V14ZM7.5 15C8.32843 15 9 14.3284 9 13.5C9 12.6716 8.32843 12 7.5 12C6.67157 12 6 12.6716 6 13.5C6 14.3284 6.67157 15 7.5 15Z"
            />
          </svg>
          {filtersCount > 0 && (
            <div className={styles.iconCount}>{filtersCount}</div>
          )}
        </div>
        {isOpen && onClearAll && (
          <Fragment>
            <div className={styles.spacer} />
            <button
              className={styles.eraseButton}
              type="button"
              onClick={onClearAll}
            >
              {t('common:filters.eraseAll')}
            </button>
          </Fragment>
        )}
        <button
          className={styles.closeButton}
          type="button"
          onClick={handleToggleFiltersBar}
          aria-label={t(`common:filters.${isOpen ? 'close' : 'open'}`)}
        >
          <svg
            focusable="false"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5 3.5L5.5 8L10.5 12.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  );
}

FiltersBar.defaultProps = {
  filtersCount: 0,
  onClearAll: null,
};

FiltersBar.propTypes = {
  cookieName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  filtersCount: PropTypes.number,
  onClearAll: PropTypes.func,
};

export default FiltersBar;
