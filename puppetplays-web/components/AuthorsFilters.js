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
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('common:filters')}</h1>
        <button type="button" onClick={onClearAll}>
          {t('common:eraseAll')}
        </button>
      </header>
      <div>
        <FilterSelect
          name="languages"
          placeholder={t('common:mainLanguagePlaceholder')}
          options={languageOptions}
          onChange={onChange}
          value={selectedLanguages}
        />
        <FilterSelect
          name="places"
          placeholder={t('common:compositionPlacePlaceholder')}
          options={placeOptions}
          onChange={onChange}
          value={selectedPlaces}
        />
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
