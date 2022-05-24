import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import get from 'lodash/get';
import { identity } from 'lib/utils';
import FilterSelect from 'components/FilterSelect';
import FilterRange from 'components/FilterRange';
import FilterCheckbox from 'components/FilterCheckbox';
import FiltersBar from 'components/FiltersBar';

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
  isInitiallyOpen,
}) {
  const { t } = useTranslation();

  const filtersCount = [
    get(selectedLanguages, 'length', 0),
    get(selectedPlaces, 'length', 0),
    !!selectedPeriodMin || !!selectedPeriodMax,
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
    <FiltersBar
      isInitiallyOpen={isInitiallyOpen}
      cookieName="isWorksFiltersBarOpened"
      filtersCount={filtersCount}
      onClearAll={onClearAll}
    >
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
    </FiltersBar>
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
  isInitiallyOpen: true,
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
  isInitiallyOpen: PropTypes.bool,
};

export default WorksFilters;
