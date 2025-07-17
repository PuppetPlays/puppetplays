import FiltersBar from 'components/FiltersBar';
import FilterSelect from 'components/FilterSelect';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useState } from 'react';

function AnthologyFilters({ filters = {}, onChange, onClearAll }) {
  const { t } = useTranslation();

  const [languageOptions] = useState([
    { id: 'français', title: 'Français' },
    { id: 'allemand', title: 'Allemand' },
    { id: 'italien', title: 'Italien' },
    { id: 'anglais', title: 'Anglais' },
  ]);

  const [centuryOptions] = useState([
    { id: '16', title: '16e siècle' },
    { id: '17', title: '17e siècle' },
    { id: '18', title: '18e siècle' },
    { id: '19', title: '19e siècle' },
    { id: '20', title: '20e siècle' },
    { id: '21', title: '21e siècle' },
  ]);

  const [sortOptions] = useState([
    { id: 'title_asc', title: t('common:sortBy.titleAsc') },
    { id: 'title_desc', title: t('common:sortBy.titleDesc') },
    { id: 'date_asc', title: t('common:sortBy.dateAsc') },
    { id: 'date_desc', title: t('common:sortBy.dateDesc') },
  ]);

  const getSelectedValues = (options, key) => {
    if (options && filters[key]) {
      return options.filter(({ id }) => filters[key].includes(id));
    }
    return null;
  };

  return (
    <FiltersBar onClearAll={onClearAll}>
      <FilterSelect
        name="language"
        label={t('common:language')}
        placeholder={t('common:language')}
        options={languageOptions}
        value={getSelectedValues(languageOptions, 'language')}
        onChange={onChange}
        isMulti
      />
      <FilterSelect
        name="century"
        label={t('common:century')}
        placeholder={t('common:century')}
        options={centuryOptions}
        value={getSelectedValues(centuryOptions, 'century')}
        onChange={onChange}
        isMulti
      />
      <FilterSelect
        name="sort"
        label={t('common:sortBy.label')}
        placeholder={t('common:sortBy.label')}
        options={sortOptions}
        value={getSelectedValues(sortOptions, 'sort')}
        onChange={onChange}
      />
    </FiltersBar>
  );
}

AnthologyFilters.propTypes = {
  filters: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};

export default AnthologyFilters;
