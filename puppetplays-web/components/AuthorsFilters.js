import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import FilterSelect from 'components/FilterSelect';
import styles from './filters.module.scss';

function AuthorsFilters({
  languageOptions,
  placeOptions,
  selectedLanguages,
  selectedPlaces,
  onChange,
  onClearAll,
}) {
  const { t } = useTranslation();

  return (
    <div className={`${styles.container} ${styles.isOpen}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('common:filters')}</h1>
        <div className={styles.icon}>
          <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.33681 8L0 8V6L9.03544 6C9.27806 4.30385 10.7368 3 12.5 3C14.2632 3 15.7219 4.30385 15.9646 6L20 6V8L15.6632 8C15.1015 9.18247 13.8962 10 12.5 10C11.1038 10 9.89855 9.18247 9.33681 8ZM11 6.5C11 5.67157 11.6716 5 12.5 5C13.3284 5 14 5.67157 14 6.5C14 7.32843 13.3284 8 12.5 8C11.6716 8 11 7.32843 11 6.5ZM0 14H4.03544C4.27806 15.6961 5.73676 17 7.5 17C9.26324 17 10.7219 15.6961 10.9646 14H20V12H10.6632C10.1015 10.8175 8.8962 10 7.5 10C6.1038 10 4.89855 10.8175 4.33682 12H0V14ZM7.5 15C8.32843 15 9 14.3284 9 13.5C9 12.6716 8.32843 12 7.5 12C6.67157 12 6 12.6716 6 13.5C6 14.3284 6.67157 15 7.5 15Z"
            />
          </svg>
        </div>
        <div className={styles.spacer} />
        <button
          className={styles.eraseButton}
          type="button"
          onClick={onClearAll}
        >
          {t('common:eraseAll')}
        </button>
      </header>
      <div className={styles.content}>
        <div style={{ position: 'relative', zIndex: 100 }}>
          <FilterSelect
            name="languages"
            placeholder={t('common:mainLanguagePlaceholder')}
            options={languageOptions}
            onChange={onChange}
            value={selectedLanguages}
          />
        </div>
        <div style={{ position: 'relative', zIndex: 90 }}>
          <FilterSelect
            name="places"
            placeholder={t('common:compositionPlacePlaceholder')}
            options={placeOptions}
            onChange={onChange}
            value={selectedPlaces}
          />
        </div>
      </div>
    </div>
  );
}

AuthorsFilters.defaultProps = {
  languageOptions: [],
  placeOptions: [],
  selectedLanguages: [],
  selectedPlaces: [],
};

AuthorsFilters.propTypes = {
  languageOptions: PropTypes.arrayOf(PropTypes.object),
  placeOptions: PropTypes.arrayOf(PropTypes.object),
  selectedLanguages: PropTypes.arrayOf(PropTypes.object),
  selectedPlaces: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};

export default AuthorsFilters;
