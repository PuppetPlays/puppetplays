import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import constant from 'lodash/constant';
import cond from 'lodash/cond';
import stubTrue from 'lodash/stubTrue';
import negate from 'lodash/negate';
import map from 'lodash/fp/map';
import getFp from 'lodash/fp/get';
import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import { identity } from 'lib/utils';
import { getFetchAPIClient } from 'lib/api';
import { getAllLanguagesQuery, getAllPlacesQuery } from 'lib/filtersApi';
import FilterSelect from 'components/FilterSelect';
import FiltersBar from 'components/FiltersBar';

function AuthorsFilters({ filters, onChange, onClearAll }) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [filtersOptions, setFiltersOptions] = useState({});

  const [genderOptions] = useState([
    { id: 'female', title: t('common:filters.female') },
    { id: 'male', title: t('common:filters.male') },
  ]);
  const [typeOptions] = useState([
    { id: 'persons', title: t('common:filters.author') },
    { id: 'companies', title: t('common:filters.company') },
  ]);

  const getSelectedValues = (options, key) => {
    if (options && filters[key]) {
      return options.filter(({ id }) => filters[key].includes(id));
    }
    return null;
  };

  useEffect(() => {
    const apiClient = getFetchAPIClient({
      variables: { locale },
    });

    Promise.all([
      apiClient(getAllLanguagesQuery('persons')),
      apiClient(getAllPlacesQuery('persons')),
    ]).then(result => {
      const [languages, places] = result;

      setFiltersOptions({
        languages: languages.entries,
        places: places.entries,
      });
    });
  }, [setFiltersOptions, locale]);

  const selectedLanguages = getSelectedValues(
    filtersOptions.languages,
    'languages',
  );
  const selectedPlaces = getSelectedValues(filtersOptions.places, 'places');
  const selectedGender = getSelectedValues(genderOptions, 'gender');
  const selectedType = getSelectedValues(typeOptions, 'type');

  const filtersCount = [
    get(selectedLanguages, 'length', 0),
    get(selectedPlaces, 'length', 0),
    selectedGender,
    selectedType,
  ].filter(identity).length;

  const handleChangeFilters = useCallback(
    (value, { name }) => {
      const isArrayWithElements = v => isArray(v) && v.length > 0;
      const getNewFilterValue = cond([
        [isArrayWithElements, map(getFp('id'))],
        [isArray, constant(null)],
        [negate(isNil), getFp('id')],
        [stubTrue, constant(null)],
      ]);

      onChange(getNewFilterValue(value), { name });
    },
    [onChange],
  );

  return (
    <FiltersBar
      cookieName="isAuthorsFiltersBarOpened"
      filtersCount={filtersCount}
      onClearAll={onClearAll}
    >
      {Object.keys(filtersOptions).length > 0 && (
        <>
          <div style={{ position: 'relative', zIndex: 100 }}>
            <FilterSelect
              name="languages"
              placeholder={t('common:filters.mainLanguagePlaceholder')}
              options={filtersOptions.languages}
              onChange={handleChangeFilters}
              value={selectedLanguages}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 90 }}>
            <FilterSelect
              name="places"
              placeholder={t('common:filters.compositionPlacePlaceholder')}
              options={filtersOptions.places}
              onChange={handleChangeFilters}
              value={selectedPlaces}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 80 }}>
            <FilterSelect
              name="gender"
              placeholder={t('common:filters.genderPlaceholder')}
              options={genderOptions}
              onChange={handleChangeFilters}
              value={selectedGender}
              isMulti={false}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 70 }}>
            <FilterSelect
              name="type"
              placeholder={t('common:filters.typePlaceholder')}
              options={typeOptions}
              onChange={handleChangeFilters}
              value={selectedType}
              isMulti={false}
            />
          </div>
        </>
      )}
    </FiltersBar>
  );
}

AuthorsFilters.defaultProps = {
  filters: {},
};

AuthorsFilters.propTypes = {
  filters: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};

export default AuthorsFilters;
