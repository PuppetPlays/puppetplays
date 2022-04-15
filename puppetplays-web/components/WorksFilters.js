import { Fragment } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import get from 'lodash/get';
import { identity } from 'lib/utils';
import FilterSelect from 'components/FilterSelect';
import FilterRange from 'components/FilterRange';
import styles from './filters.module.scss';
import FilterCheckbox from 'components/FilterCheckbox';

function WorksFilters({
  languageOptions,
  placeOptions,
  periodMinMax,
  authorsOptions,
  literaryTonesOptions,
  animationTechniquesOptions,
  theatricalTechniquesOptions,
  audiencesOptions,
  formatsOptions,
  tagsOptions,
  selectedLanguages,
  selectedPlaces,
  selectedPeriodMin,
  selectedPeriodMax,
  selectedAuthors,
  selectedLiteraryTones,
  selectedAnimationTechniques,
  selectedTheatricalTechniques,
  selectedAudiences,
  selectedFormats,
  selectedTags,
  publicDomain,
  onChange,
  onClearAll,
  isOpen,
  onToggle,
}) {
  const { t } = useTranslation();

  const filtersCount = [
    get(selectedLanguages, 'length', 0),
    get(selectedPlaces, 'length', 0),
    selectedPeriodMin,
    get(selectedAuthors, 'length', 0),
    get(selectedLiteraryTones, 'length', 0),
    get(selectedAnimationTechniques, 'length', 0),
    get(selectedTheatricalTechniques, 'length', 0),
    get(selectedAudiences, 'length', 0),
    get(selectedFormats, 'length', 0),
    get(selectedTags, 'length', 0),
    publicDomain,
  ].filter(identity).length;

  return (
    <div className={`${styles.container} ${isOpen ? styles.isOpen : ''}`}>
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
        {isOpen && (
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
        <button className={styles.closeButton} type="button" onClick={onToggle}>
          <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.5 3.5L5.5 8L10.5 12.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>
      {isOpen && (
        <div className={styles.content}>
          <div style={{ position: 'relative', zIndex: 100 }}>
            <FilterSelect
              name="mainLanguage"
              placeholder={t('common:filters.mainLanguagePlaceholder')}
              options={languageOptions}
              onChange={onChange}
              value={selectedLanguages}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 90 }}>
            <FilterSelect
              name="compositionPlace"
              placeholder={t('common:filters.compositionPlacePlaceholder')}
              options={placeOptions}
              onChange={onChange}
              value={selectedPlaces}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 80 }}>
            <FilterRange
              name="period"
              bounds={periodMinMax}
              valueMin={selectedPeriodMin}
              valueMax={selectedPeriodMax}
              onAfterChange={onChange}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 70 }}>
            <FilterSelect
              name="authors"
              placeholder={t('common:filters.authorsPlaceholder')}
              options={authorsOptions}
              onChange={onChange}
              value={selectedAuthors}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 60 }}>
            <FilterSelect
              name="literaryTones"
              placeholder={t('common:filters.literaryTonesPlaceholder')}
              options={literaryTonesOptions}
              onChange={onChange}
              value={selectedLiteraryTones}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 50 }}>
            <FilterSelect
              name="animationTechniques"
              placeholder={t('common:filters.animationTechniquesPlaceholder')}
              options={animationTechniquesOptions}
              onChange={onChange}
              value={selectedAnimationTechniques}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 45 }}>
            <FilterSelect
              name="theatricalTechniques"
              placeholder={t('common:filters.theatricalTechniquesPlaceholder')}
              options={theatricalTechniquesOptions}
              onChange={onChange}
              value={selectedTheatricalTechniques}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 40 }}>
            <FilterSelect
              name="audience"
              placeholder={t('common:filters.audiencePlaceholder')}
              options={audiencesOptions}
              onChange={onChange}
              value={selectedAudiences}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 30 }}>
            <FilterSelect
              name="formats"
              placeholder={t('common:filters.formatsPlaceholder')}
              options={formatsOptions}
              onChange={onChange}
              value={selectedFormats}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 20 }}>
            <FilterSelect
              name="relatedToTags"
              placeholder={t('common:filters.relatedToTagsPlaceholder')}
              options={tagsOptions}
              onChange={onChange}
              value={selectedTags}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <FilterCheckbox
              name="publicDomain"
              checked={publicDomain}
              onChange={onChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

WorksFilters.defaultProps = {
  languageOptions: [],
  placeOptions: [],
  periodMinMax: null,
  authorsOptions: [],
  literaryTonesOptions: [],
  animationTechniquesOptions: [],
  audiencesOptions: [],
  formatsOptions: [],
  tagsOptions: [],
  selectedLanguages: [],
  selectedPlaces: [],
  selectedPeriodMin: null,
  selectedPeriodMax: null,
  selectedAuthors: [],
  selectedLiteraryTones: [],
  selectedAnimationTechniques: [],
  selectedAudiences: [],
  selectedFormats: [],
  selectedTags: [],
  publicDomain: false,
  isOpen: true,
};

WorksFilters.propTypes = {
  languageOptions: PropTypes.arrayOf(PropTypes.object),
  placeOptions: PropTypes.arrayOf(PropTypes.object),
  periodMinMax: PropTypes.arrayOf(PropTypes.number),
  authorsOptions: PropTypes.arrayOf(PropTypes.object),
  literaryTonesOptions: PropTypes.arrayOf(PropTypes.object),
  animationTechniquesOptions: PropTypes.arrayOf(PropTypes.object),
  theatricalTechniquesOptions: PropTypes.arrayOf(PropTypes.object),
  audiencesOptions: PropTypes.arrayOf(PropTypes.object),
  formatsOptions: PropTypes.arrayOf(PropTypes.object),
  tagsOptions: PropTypes.arrayOf(PropTypes.object),
  selectedLanguages: PropTypes.arrayOf(PropTypes.object),
  selectedPlaces: PropTypes.arrayOf(PropTypes.object),
  selectedPeriodMin: PropTypes.number,
  selectedPeriodMax: PropTypes.number,
  selectedAuthors: PropTypes.arrayOf(PropTypes.object),
  selectedLiteraryTones: PropTypes.arrayOf(PropTypes.object),
  selectedAnimationTechniques: PropTypes.arrayOf(PropTypes.object),
  selectedTheatricalTechniques: PropTypes.arrayOf(PropTypes.object),
  selectedAudiences: PropTypes.arrayOf(PropTypes.object),
  selectedFormats: PropTypes.arrayOf(PropTypes.object),
  selectedTags: PropTypes.arrayOf(PropTypes.object),
  publicDomain: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};

export default WorksFilters;
