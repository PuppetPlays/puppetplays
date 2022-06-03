import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import get from 'lodash/get';
import { hasAtLeastOneItem, identity } from 'lib/utils';
import { getAllWorksKeywordsQuery, getFetchAPIClient } from 'lib/api';
import {
  getAllAnimationTechniquesQuery,
  getAllTheatricalTechniquesQuery,
  getAllAudiencesQuery,
  getAllFormatsQuery,
  getAllLanguagesQuery,
  getAllPersonsQuery,
  getAllLiteraryTonesQuery,
  getAllPlacesQuery,
  getPeriodBoundsQuery,
  getFilterEntriesByIdsQuery,
  getSectionName,
} from 'lib/filtersApi';
import FilterSelect from 'components/FilterSelect';
import FilterRange from 'components/FilterRange';
import FilterCheckbox from 'components/FilterCheckbox';
import FiltersBar from 'components/FiltersBar';

function WorksFilters({ filters, onChange, onClearAll }) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [filtersOptions, setFiltersOptions] = useState({});
  const apiClient = useCallback(
    (query) =>
      getFetchAPIClient({
        variables: { locale },
      })(query),
    [locale],
  );

  const getSelectedValues = (options, key) => {
    if (options && filters[key]) {
      return options.filter(({ id }) => filters[key].includes(id));
    }
    return null;
  };

  const getLanguagesOptions = () => {
    apiClient(getAllLanguagesQuery('works')).then((languages) => {
      setFiltersOptions({
        ...filtersOptions,
        languages: languages.entries,
      });
    });
  };
  const getPlacesOptions = () => {
    apiClient(getAllPlacesQuery('works')).then((places) => {
      setFiltersOptions({
        ...filtersOptions,
        places: places.entries,
      });
    });
  };
  const getPersonsOptions = () => {
    apiClient(getAllPersonsQuery).then((authors) => {
      setFiltersOptions({
        ...filtersOptions,
        authors: authors.entries,
      });
    });
  };
  const getLiteraryTonesOptions = () => {
    apiClient(getAllLiteraryTonesQuery).then((literaryTones) => {
      setFiltersOptions({
        ...filtersOptions,
        literaryTones: literaryTones.entries,
      });
    });
  };
  const getAnimationTechniquesOptions = () => {
    apiClient(getAllAnimationTechniquesQuery).then((animationTechniques) => {
      setFiltersOptions({
        ...filtersOptions,
        animationTechniques: animationTechniques.entries,
      });
    });
  };
  const getTheatricalTechniquesOptions = () => {
    apiClient(getAllTheatricalTechniquesQuery).then((theatricalTechniques) => {
      setFiltersOptions({
        ...filtersOptions,
        theatricalTechniques: theatricalTechniques.entries,
      });
    });
  };
  const getAudiencesOptions = () => {
    apiClient(getAllAudiencesQuery).then((audiences) => {
      setFiltersOptions({
        ...filtersOptions,
        audiences: audiences.entries,
      });
    });
  };
  const getFormatsOptions = () => {
    apiClient(getAllFormatsQuery).then((formats) => {
      setFiltersOptions({
        ...filtersOptions,
        formats: formats.entries,
      });
    });
  };
  const getTagsOptions = () => {
    apiClient(getAllWorksKeywordsQuery).then((data) => {
      setFiltersOptions({
        ...filtersOptions,
        tags: data.tags,
      });
    });
  };

  useEffect(() => {
    const keepRequestableOptions = ([key]) =>
      key !== 'compositionMinDate' && key !== 'publicDomain';
    const keepActiveFiltersWithNoOption = ([key, values]) =>
      values && !filtersOptions[getSectionName(key)];
    const getFilersOptionsQueries = ([key]) => {
      if (key === 'relatedToTags') {
        return apiClient(getAllWorksKeywordsQuery);
      } else {
        return getFetchAPIClient({
          variables: { locale, ids: filters[key] },
        })(getFilterEntriesByIdsQuery(getSectionName(key)));
      }
    };
    const activeFiltersWithNoOption = Object.entries(filters)
      .filter(keepRequestableOptions)
      .filter(keepActiveFiltersWithNoOption);
    const requests = activeFiltersWithNoOption.map(getFilersOptionsQueries);
    const requestsKeys = activeFiltersWithNoOption.map(([key]) => key);

    if (requests.length > 0) {
      Promise.all(requests).then((results) => {
        const newFilterOptions = results.reduce((acc, data, index) => {
          acc[getSectionName(requestsKeys[index])] = data.entries || data.tags;
          return acc;
        }, {});
        setFiltersOptions({
          ...filtersOptions,
          ...newFilterOptions,
        });
      });
    }
  }, [filters, filtersOptions, locale, apiClient]);

  useEffect(() => {
    apiClient(getPeriodBoundsQuery).then((periodBounds) => {
      const getSafelyPeriodBound = (bound) =>
        hasAtLeastOneItem(bound) ? bound[0].value : null;

      setFiltersOptions({
        ...filtersOptions,
        periodBounds: [
          getSafelyPeriodBound(periodBounds.min),
          getSafelyPeriodBound(periodBounds.max),
        ],
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiClient, setFiltersOptions]);

  const selectedLanguages = getSelectedValues(
    filtersOptions.languages,
    'mainLanguage',
  );
  const selectedPlaces = getSelectedValues(
    filtersOptions.places,
    'compositionPlace',
  );
  const selectedPeriodMin = get(filters, 'compositionMinDate[0]', null);
  const selectedPeriodMax = get(filters, 'compositionMinDate[1]', null);
  const selectedPersons = getSelectedValues(filtersOptions.persons, 'authors');
  const selectedLiteraryTones = getSelectedValues(
    filtersOptions.literaryTones,
    'literaryTones',
  );
  const selectedAnimationTechniques = getSelectedValues(
    filtersOptions.animationTechniques,
    'animationTechniques',
  );
  const selectedTheatricalTechniques = getSelectedValues(
    filtersOptions.theatricalTechniques,
    'theatricalTechniques',
  );
  const selectedAudiences = getSelectedValues(
    filtersOptions.audiences,
    'audience',
  );
  const selectedFormats = getSelectedValues(filtersOptions.formats, 'formats');
  const selectedTags = getSelectedValues(filtersOptions.tags, 'relatedToTags');

  const filtersCount = [
    get(selectedLanguages, 'length', 0),
    get(selectedPlaces, 'length', 0),
    !!selectedPeriodMin || !!selectedPeriodMax,
    get(selectedPersons, 'length', 0),
    get(selectedLiteraryTones, 'length', 0),
    get(selectedAnimationTechniques, 'length', 0),
    get(selectedTheatricalTechniques, 'length', 0),
    get(selectedAudiences, 'length', 0),
    get(selectedFormats, 'length', 0),
    get(selectedTags, 'length', 0),
    filters.publicDomain,
  ].filter(identity).length;

  const handleChangeFilters = useCallback(
    (value, { name }) => {
      let normalizedValue;
      let normalizedName = name;
      if (name === 'period') {
        normalizedName = 'compositionMinDate';
        if (
          value[0] !== filtersOptions.periodBounds[0] &&
          value[1] !== filtersOptions.periodBounds[1]
        ) {
          normalizedValue = [value[0], value[1]];
        } else if (value[0] !== filtersOptions.periodBounds[0]) {
          normalizedValue = [value[0], 0];
        } else if (value[1] !== filtersOptions.periodBounds[1]) {
          normalizedValue = [0, value[1]];
        } else {
          normalizedValue = null;
        }
      } else if (name === 'publicDomain') {
        normalizedValue = value ? value : undefined;
      } else {
        normalizedValue = value.length > 0 ? value.map((v) => v.id) : null;
      }
      onChange(normalizedValue, { name: normalizedName });
    },
    [filtersOptions, onChange],
  );

  return (
    <FiltersBar
      cookieName="isWorksFiltersBarOpened"
      filtersCount={filtersCount}
      onClearAll={onClearAll}
    >
      <div style={{ position: 'relative', zIndex: 100 }}>
        <FilterSelect
          name="mainLanguage"
          placeholder={t('common:filters.mainLanguagePlaceholder')}
          options={filtersOptions.languages}
          onChange={handleChangeFilters}
          onFocus={getLanguagesOptions}
          value={selectedLanguages}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 90 }}>
        <FilterSelect
          name="compositionPlace"
          placeholder={t('common:filters.compositionPlacePlaceholder')}
          options={filtersOptions.places}
          onChange={handleChangeFilters}
          onFocus={getPlacesOptions}
          value={selectedPlaces}
        />
      </div>
      {filtersOptions.periodBounds && (
        <div style={{ position: 'relative', zIndex: 80 }}>
          <FilterRange
            name="period"
            bounds={filtersOptions.periodBounds}
            valueMin={selectedPeriodMin}
            valueMax={selectedPeriodMax}
            onAfterChange={handleChangeFilters}
          />
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 70 }}>
        <FilterSelect
          name="authors"
          placeholder={t('common:filters.authorsPlaceholder')}
          options={filtersOptions.persons}
          onChange={handleChangeFilters}
          onFocus={getPersonsOptions}
          value={selectedPersons}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 60 }}>
        <FilterSelect
          name="literaryTones"
          placeholder={t('common:filters.literaryTonesPlaceholder')}
          options={filtersOptions.literaryTones}
          onChange={handleChangeFilters}
          onFocus={getLiteraryTonesOptions}
          value={selectedLiteraryTones}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 50 }}>
        <FilterSelect
          name="animationTechniques"
          placeholder={t('common:filters.animationTechniquesPlaceholder')}
          options={filtersOptions.animationTechniques}
          onChange={handleChangeFilters}
          onFocus={getAnimationTechniquesOptions}
          value={selectedAnimationTechniques}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 45 }}>
        <FilterSelect
          name="theatricalTechniques"
          placeholder={t('common:filters.theatricalTechniquesPlaceholder')}
          options={filtersOptions.theatricalTechniques}
          onChange={handleChangeFilters}
          onFocus={getTheatricalTechniquesOptions}
          value={selectedTheatricalTechniques}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 40 }}>
        <FilterSelect
          name="audience"
          placeholder={t('common:filters.audiencePlaceholder')}
          options={filtersOptions.audiences}
          onChange={handleChangeFilters}
          onFocus={getAudiencesOptions}
          value={selectedAudiences}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 30 }}>
        <FilterSelect
          name="formats"
          placeholder={t('common:filters.formatsPlaceholder')}
          options={filtersOptions.formats}
          onChange={handleChangeFilters}
          onFocus={getFormatsOptions}
          value={selectedFormats}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 20 }}>
        <FilterSelect
          name="relatedToTags"
          placeholder={t('common:filters.relatedToTagsPlaceholder')}
          options={filtersOptions.tags}
          onChange={handleChangeFilters}
          onFocus={getTagsOptions}
          value={selectedTags}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 10 }}>
        <FilterCheckbox
          name="publicDomain"
          checked={!!filters.publicDomain}
          onChange={handleChangeFilters}
        />
      </div>
    </FiltersBar>
  );
}

WorksFilters.defaultProps = {
  filters: {},
  isInitiallyOpen: true,
};

WorksFilters.propTypes = {
  filters: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
  isInitiallyOpen: PropTypes.bool,
};

export default WorksFilters;
