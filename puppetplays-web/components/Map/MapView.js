import {
  fetchAPI,
  getWorksCardByIdsQuery,
  getAllWorksForMapQuery,
  buildSearchQuery,
} from 'lib/api';
import { worksStateToGraphqlVariables as stateToGraphqlVariables } from 'lib/filters';
import { hasAtLeastOneItem } from 'lib/utils';
import { groupBy } from 'lodash';
import { useTranslation } from 'next-i18next';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import * as olProj from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import PropTypes from 'prop-types';
import { Fragment, useCallback, useEffect, useState, useMemo } from 'react';

import Layers from './Layers';
import Map from './Map';
import WorksList from './WorksList';

const clusteredByCountrySource = new VectorSource({ features: [] });
const clusteredByPlaceSource = new VectorSource({ features: [] });

// Cache for map data to avoid unnecessary API calls
let mapDataCache = null;
let mapDataCacheKey = null;

const MapView = ({ filters = {}, searchTerms = '', locale }) => {
  const { t } = useTranslation('common');
  const [selectInteraction, setSelectInteraction] = useState(null);
  const [selectedWorks, setSelectedWorks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [center] = useState(olProj.fromLonLat([10, 50]));
  const [zoom] = useState(5);

  // Create cache key for current filters/search
  const cacheKey = useMemo(() => {
    return JSON.stringify({ filters, searchTerms, locale });
  }, [filters, searchTerms, locale]);

  // Memoized processing of map data
  const processMapData = useMemo(() => {
    return entries => {
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
    };
  }, []);

  // Function to update map sources with processed data
  const updateMapSources = useCallback((countries, places) => {
    clusteredByPlaceSource.clear();
    clusteredByCountrySource.clear();

    const createFeatureForSource =
      source =>
      ({ coordinates, name, type, ids }, index) => {
        const feature = new Feature({
          geometry: new Point(coordinates).transform('EPSG:4326', 'EPSG:3857'),
          name,
        });
        feature.setProperties({ ids, type, isSelectable: true });
        feature.setId(index);
        source.addFeature(feature);
      };

    places.forEach(createFeatureForSource(clusteredByPlaceSource));
    countries.forEach(createFeatureForSource(clusteredByCountrySource));
  }, []);

  useEffect(() => {
    // Return early if cache is valid
    if (mapDataCache && mapDataCacheKey === cacheKey) {
      const { countries, places } = mapDataCache;
      updateMapSources(countries, places);
      return;
    }

    setIsLoading(true);

    // Always fetch ALL data for map (not paginated list data)
    // This ensures the map shows all works, not just the 10 from list view
    fetchAPI(getAllWorksForMapQuery(filters), {
      variables: {
        locale,
        search: buildSearchQuery(searchTerms),
        ...stateToGraphqlVariables(filters),
      },
    })
      .then(({ entries }) => {
        const { countries, places } = processMapData(entries);
        updateMapSources(countries, places);

        // Cache the processed data
        mapDataCache = { countries, places };
        mapDataCacheKey = cacheKey;
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading map data:', error);
        setIsLoading(false);
      });
  }, [
    filters,
    locale,
    searchTerms,
    cacheKey,
    processMapData,
    updateMapSources,
  ]);

  useEffect(() => {
    setSelectedWorks(null);
    if (selectInteraction) {
      selectInteraction.getFeatures().clear();
    }
  }, [setSelectedWorks, filters, selectInteraction]);

  // Close WorksList when user types in search bar
  useEffect(() => {
    setSelectedWorks(null);
    if (selectInteraction) {
      selectInteraction.getFeatures().clear();
    }
  }, [searchTerms]);

  const handleSetSelectInteraction = useCallback(
    select => {
      setSelectInteraction(select);
    },
    [setSelectInteraction],
  );

  const handleClick = useCallback(
    evt => {
      if (evt.selected.length > 0) {
        const { ids } = evt.selected[0].getProperties();

        if (hasAtLeastOneItem(ids)) {
          fetchAPI(getWorksCardByIdsQuery, {
            variables: { id: ids, locale },
          }).then(({ entries }) => {
            setSelectedWorks(entries);
          });
        }
      } else if (evt.deselected.length > 0) {
        setSelectedWorks(null);
      }
    },
    [locale],
  );

  const handleCloseList = useCallback(() => {
    setSelectedWorks(null);
    if (selectInteraction) {
      selectInteraction.getFeatures().clear();
    }
  }, [selectInteraction]);

  return (
    <Fragment>
      <div
        className="map-view"
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              background: 'rgba(32, 55, 177, 0.95)',
              color: 'white',
              padding: '20px 30px',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              fontSize: '16px',
              fontWeight: '500',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            {t('mapLoadingMessage')}
            <style jsx>{`
              @keyframes spin {
                to {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        )}
        <WorksList works={selectedWorks} onClose={handleCloseList} />
        <Map
          center={center}
          zoom={zoom}
          onClick={handleClick}
          setSelectInteraction={handleSetSelectInteraction}
        >
          <Layers
            byCountrySource={clusteredByCountrySource}
            byPlaceSource={clusteredByPlaceSource}
          />
        </Map>
      </div>
    </Fragment>
  );
};

MapView.propTypes = {
  filters: PropTypes.object,
  searchTerms: PropTypes.string,
  locale: PropTypes.string.isRequired,
};

export default MapView;
