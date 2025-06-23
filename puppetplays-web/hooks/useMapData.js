import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchAPI, getAllWorksForMapQuery, buildSearchQuery } from 'lib/api';
import { worksStateToGraphqlVariables as stateToGraphqlVariables } from 'lib/filters';
import { hasAtLeastOneItem } from 'lib/utils';
import { groupBy } from 'lodash';

// Global cache for map data
const mapDataCache = new Map();

/**
 * Custom hook for managing map data with caching and optimization
 * @param {Object} filters - Current filters
 * @param {string} searchTerms - Search terms
 * @param {string} locale - Current locale
 * @param {Object|null} listData - Data from list view to avoid duplicate API calls
 * @returns {Object} - { mapData, isLoading, error }
 */
export const useMapData = (
  filters = {},
  searchTerms = '',
  locale,
  listData = null,
) => {
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create cache key for current filters/search
  const cacheKey = useMemo(() => {
    return JSON.stringify({ filters, searchTerms, locale });
  }, [filters, searchTerms, locale]);

  // Memoized processing of map data
  const processMapData = useCallback((entries) => {
    const entriesWithCompositionPlace = entries.filter(entry =>
      hasAtLeastOneItem(entry.compositionPlace),
    );

    const countries = Object.entries(
      groupBy(entriesWithCompositionPlace, entry => {
        const { typeHandle, title, country } = entry.compositionPlace[0];
        return typeHandle === 'countries' ? title : country[0].title;
      }),
    ).map(([countryName, works]) => {
      const compositionPlace = works[0].compositionPlace[0];
      const { longitude, latitude } =
        compositionPlace.typeHandle === 'countries'
          ? compositionPlace
          : compositionPlace.country[0];
      return {
        name: countryName,
        coordinates: [longitude, latitude],
        ids: works && Array.isArray(works) ? works.map(w => w.id) : [],
        type: 'countries',
      };
    });

    const places = Object.entries(
      groupBy(
        entriesWithCompositionPlace,
        entry => entry.compositionPlace[0].title,
      ),
    ).map(([name, works]) => {
      const { longitude, latitude, typeHandle } =
        works[0].compositionPlace[0];
      return {
        name,
        coordinates: [longitude, latitude],
        ids: works && Array.isArray(works) ? works.map(w => w.id) : [],
        type: typeHandle,
      };
    });

    return { countries, places };
  }, []);

  useEffect(() => {
    // Return early if cache is valid
    if (mapDataCache.has(cacheKey)) {
      setMapData(mapDataCache.get(cacheKey));
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Try to use data from list view if available and no complex search/filters
    if (listData && listData.entries && !searchTerms && Object.keys(filters).length <= 1) {
      try {
        const processedData = processMapData(listData.entries);
        setMapData(processedData);
        
        // Cache the processed data
        mapDataCache.set(cacheKey, processedData);
        setIsLoading(false);
        return;
      } catch (err) {
        console.warn('Error processing list data for map, falling back to API:', err);
      }
    }

    // Fetch optimized data for map
    fetchAPI(getAllWorksForMapQuery(filters), {
      variables: {
        locale,
        search: buildSearchQuery(searchTerms),
        ...stateToGraphqlVariables(filters),
      },
    }).then(({ entries }) => {
      const processedData = processMapData(entries);
      setMapData(processedData);
      
      // Cache the processed data
      mapDataCache.set(cacheKey, processedData);
      setIsLoading(false);
      setError(null);
    }).catch(err => {
      console.error('Error loading map data:', err);
      setError(err);
      setIsLoading(false);
    });
  }, [filters, locale, searchTerms, listData, cacheKey, processMapData]);

  return { mapData, isLoading, error };
};

export default useMapData; 