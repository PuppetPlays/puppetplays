import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import FilterSelect from 'components/FilterSelect';
import FilterRange from 'components/FilterRange';
import styles from './filters.module.scss';

function WorksFilters({
  languageOptions,
  placeOptions,
  periodMinMax,
  selectedLanguages,
  selectedPlaces,
  selectedPeriodMin,
  selectedPeriodMax,
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
          name="mainLanguage"
          placeholder={t('common:mainLanguagePlaceholder')}
          options={languageOptions}
          onChange={onChange}
          value={selectedLanguages}
        />
        <FilterSelect
          name="compositionPlace"
          placeholder={t('common:compositionPlacePlaceholder')}
          options={placeOptions}
          onChange={onChange}
          value={selectedPlaces}
        />
        <FilterRange
          name="period"
          bounds={periodMinMax}
          valueMin={selectedPeriodMin}
          valueMax={selectedPeriodMax}
          onAfterChange={onChange}
        />
      </div>
    </div>
  );
}

WorksFilters.defaultProps = {
  languageOptions: [],
  placeOptions: [],
  periodMinMax: null,
  selectedLanguages: [],
  selectedPlaces: [],
  selectedPeriodMin: null,
  selectedPeriodMax: null,
};

WorksFilters.propTypes = {
  languageOptions: PropTypes.arrayOf(PropTypes.object),
  placeOptions: PropTypes.arrayOf(PropTypes.object),
  periodMinMax: PropTypes.arrayOf(PropTypes.number),
  selectedLanguages: PropTypes.arrayOf(PropTypes.object),
  selectedPlaces: PropTypes.arrayOf(PropTypes.object),
  selectedPeriodMin: PropTypes.number,
  selectedPeriodMax: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};

export default WorksFilters;
