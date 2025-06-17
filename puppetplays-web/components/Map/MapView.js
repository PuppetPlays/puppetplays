import {
  fetchAPI,
  getWorksCardByIdsQuery,
  getAllWorksQuery,
  buildSearchQuery,
} from 'lib/api';
import { worksStateToGraphqlVariables as stateToGraphqlVariables } from 'lib/filters';
import { hasAtLeastOneItem } from 'lib/utils';
import { groupBy } from 'lodash';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import * as olProj from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import PropTypes from 'prop-types';
import { Fragment, useCallback, useEffect, useState } from 'react';

import Layers from './Layers';
import Map from './Map';
import WorksList from './WorksList';

const clusteredByCountrySource = new VectorSource({ features: [] });
const clusteredByPlaceSource = new VectorSource({ features: [] });

const MapView = ({ filters = {}, searchTerms = '', locale }) => {
  const [selectInteraction, setSelectInteraction] = useState(null);
  const [selectedWorks, setSelectedWorks] = useState(null);
  const [center] = useState(olProj.fromLonLat([10, 50]));
  const [zoom] = useState(5);

  useEffect(() => {
    fetchAPI(getAllWorksQuery(filters), {
      variables: {
        locale,
        search: buildSearchQuery(searchTerms),
        ...stateToGraphqlVariables(filters),
      },
    }).then(({ entries }) => {
      clusteredByPlaceSource.clear();
      clusteredByCountrySource.clear();

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

      const createFeatureForSource =
        source =>
        ({ coordinates, name, type, ids }, index) => {
          const feature = new Feature({
            geometry: new Point(coordinates).transform(
              'EPSG:4326',
              'EPSG:3857',
            ),
            name,
          });
          feature.setProperties({ ids, type, isSelectable: true });
          feature.setId(index);
          source.addFeature(feature);
        };

      places.forEach(createFeatureForSource(clusteredByPlaceSource));
      countries.forEach(createFeatureForSource(clusteredByCountrySource));
    });
  }, [filters, locale, searchTerms]);

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
