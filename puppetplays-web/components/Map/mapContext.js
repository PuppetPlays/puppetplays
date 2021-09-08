import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'ol/interaction/Select';
import { pointerMove } from 'ol/events/condition';
import Map from 'ol/Map';
import View from 'ol/View';
import Zoom from 'ol/control/Zoom';
import { useFilters } from 'components/FiltersContext';
import { getSelectedPlaceStyle, getHoveredPlaceStyle } from './styles';

const MapContext = React.createContext();

export function MapProvider({ children, zoom, center, mapRef, onClick }) {
  const [map, setMap] = useState(null);
  const isOpen = useFilters();

  useEffect(() => {
    const options = {
      view: new View({ zoom, maxZoom: 7, minZoom: 3, center }),
      layers: [],
      controls: [new Zoom({ target: document.querySelector('.map-view') })],
      overlays: [],
    };

    const mapObject = new Map(options);
    mapObject.setTarget(mapRef.current);

    const isFeatureSelecteable = (feature) => {
      const { isSelectable } = feature.getProperties();
      return !!isSelectable;
    };

    const click = new Select({
      style: getSelectedPlaceStyle,
      filter: isFeatureSelecteable,
    });
    var hover = new Select({
      style: getHoveredPlaceStyle,
      condition: pointerMove,
      filter: isFeatureSelecteable,
    });
    mapObject.addInteraction(click);
    mapObject.addInteraction(hover);
    click.on('select', onClick);

    setMap(mapObject);

    return function cleanup() {
      mapObject.setTarget(undefined);
      mapObject.removeInteraction(click);
    };
  }, [mapRef, zoom, center, onClick]);

  useEffect(() => {
    if (map) {
      map.getView().setZoom(zoom);
    }
  }, [zoom, map]);

  useEffect(() => {
    if (map) {
      map.getView().setCenter(center);
    }
  }, [center, map]);

  useEffect(() => {
    if (map) {
      map.updateSize();
    }
  }, [isOpen, map]);

  return <MapContext.Provider value={map}>{children}</MapContext.Provider>;
}

MapProvider.propTypes = {
  children: PropTypes.node.isRequired,
  zoom: PropTypes.number.isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  mapRef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export function useMap() {
  const context = React.useContext(MapContext);

  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }

  return context;
}
