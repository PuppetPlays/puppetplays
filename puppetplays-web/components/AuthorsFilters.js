import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import get from 'lodash/get';
import { identity } from 'lib/utils';
import FilterSelect from 'components/FilterSelect';
import FiltersBar from 'components/FiltersBar';

function AuthorsFilters({
  languageOptions,
  placeOptions,
  genderOptions,
  typeOptions,
  selectedLanguages,
  selectedPlaces,
  selectedGender,
  selectedType,
  onChange,
  onClearAll,
  isInitiallyOpen,
}) {
  const { t } = useTranslation();

  const filtersCount = [
    get(selectedLanguages, 'length', 0),
    get(selectedPlaces, 'length', 0),
    selectedGender,
    selectedType,
  ].filter(identity).length;

  return (
    <FiltersBar
      isInitiallyOpen={isInitiallyOpen}
      cookieName="isAuthorsFiltersBarOpened"
      filtersCount={filtersCount}
      onClearAll={onClearAll}
    >
      <div style={{ position: 'relative', zIndex: 100 }}>
        <FilterSelect
          name="languages"
          placeholder={t('common:filters.mainLanguagePlaceholder')}
          options={languageOptions}
          onChange={onChange}
          value={selectedLanguages}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 90 }}>
        <FilterSelect
          name="places"
          placeholder={t('common:filters.compositionPlacePlaceholder')}
          options={placeOptions}
          onChange={onChange}
          value={selectedPlaces}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 80 }}>
        <FilterSelect
          name="gender"
          placeholder={t('common:filters.genderPlaceholder')}
          options={genderOptions}
          onChange={onChange}
          value={selectedGender}
          isMulti={false}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 70 }}>
        <FilterSelect
          name="type"
          placeholder={t('common:filters.typePlaceholder')}
          options={typeOptions}
          onChange={onChange}
          value={selectedType}
          isMulti={false}
        />
      </div>
    </FiltersBar>
  );
}

AuthorsFilters.defaultProps = {
  languageOptions: [],
  placeOptions: [],
  genderOptions: [],
  selectedLanguages: [],
  selectedPlaces: [],
  selectedGender: null,
  selectedType: null,
  isInitiallyOpen: true,
};

AuthorsFilters.propTypes = {
  languageOptions: PropTypes.arrayOf(PropTypes.object),
  placeOptions: PropTypes.arrayOf(PropTypes.object),
  genderOptions: PropTypes.arrayOf(PropTypes.object),
  typeOptions: PropTypes.arrayOf(PropTypes.object),
  selectedLanguages: PropTypes.arrayOf(PropTypes.object),
  selectedPlaces: PropTypes.arrayOf(PropTypes.object),
  selectedGender: PropTypes.object,
  selectedType: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
  isInitiallyOpen: PropTypes.bool,
};

export default AuthorsFilters;
