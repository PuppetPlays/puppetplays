import isTouchDevice from 'is-touch-device';
import Zoom from 'ol/control/Zoom';
import { pointerMove } from 'ol/events/condition';
import Select from 'ol/interaction/Select';
import Map from 'ol/Map';
import View from 'ol/View';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { getSelectedPlaceStyle, getHoveredPlaceStyle } from './styles';

const MapContext = React.createContext();

export function MapProvider({
  children,
  zoom,
  center,
  mapRef,
  onClick,
  setSelectInteraction,
}) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const options = {
      view: new View({ zoom, maxZoom: 12, minZoom: 3, center }),
      layers: [],
      controls: [new Zoom({ target: document.querySelector('.map-view') })],
      overlays: [],
    };

    const mapObject = new Map(options);
    mapObject.setTarget(mapRef.current);

    const isFeatureSelecteable = feature => {
      const { isSelectable } = feature.getProperties();
      return !!isSelectable;
    };

    const clickSelect = new Select({
      style: getSelectedPlaceStyle,
      filter: isFeatureSelecteable,
    });
    setSelectInteraction(clickSelect);
    var hover = new Select({
      style: getHoveredPlaceStyle,
      condition: pointerMove,
      filter: isFeatureSelecteable,
    });
    mapObject.addInteraction(clickSelect);
    if (!isTouchDevice()) {
      mapObject.addInteraction(hover);
    }
    clickSelect.on('select', onClick);

    setMap(mapObject);

    return function cleanup() {
      mapObject.setTarget(undefined);
      mapObject.removeInteraction(clickSelect);
    };
  }, [mapRef, zoom, center, onClick, setSelectInteraction]);

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
    // Vérifier si ResizeObserver est supporté
    if (!window.ResizeObserver || !map) {
      return;
    }

    let resizeObserver;

    try {
      resizeObserver = new ResizeObserver(() => {
        if (map) {
          map.updateSize();
        }
      });

      const filtersBar = document.querySelector('.filters-bar');
      if (filtersBar) {
        resizeObserver.observe(filtersBar);
      }
    } catch (error) {
      console.warn('ResizeObserver error:', error);
    }

    return function cleanup() {
      if (resizeObserver) {
        try {
          const filtersBar = document.querySelector('.filters-bar');
          if (filtersBar) {
            resizeObserver.unobserve(filtersBar);
          }
        } catch (error) {
          console.warn('ResizeObserver cleanup error:', error);
        }
      }
    };
  }, [map]);

  return <MapContext.Provider value={map}>{children}</MapContext.Provider>;
}

MapProvider.propTypes = {
  children: PropTypes.node.isRequired,
  zoom: PropTypes.number.isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  mapRef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  setSelectInteraction: PropTypes.func.isRequired,
};

export function useMap() {
  const context = React.useContext(MapContext);

  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }

  return context;
}
