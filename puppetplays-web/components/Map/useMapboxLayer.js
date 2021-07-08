import { useEffect, useRef } from 'react';
import { useMap } from './mapContext';
import MapboxVector from 'ol/layer/MapboxVector';

const useMapboxLayer = (options) => {
  const map = useMap();
  const mapboxLayer = useRef(null);

  useEffect(() => {
    if (map) {
      mapboxLayer.current = new MapboxVector(options);
      map.addLayer(mapboxLayer.current);
    }

    return () => {
      if (map && mapboxLayer.current) {
        map.removeLayer(mapboxLayer.current);
      }
    };
  }, [map, options]);

  return mapboxLayer;
};

export default useMapboxLayer;
