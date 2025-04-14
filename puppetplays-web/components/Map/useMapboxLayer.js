import VectorTile from 'ol/layer/VectorTile';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { useEffect, useRef } from 'react';

import { useMap } from './mapContext';

const useMapboxLayer = options => {
  const map = useMap();
  const mapboxLayer = useRef(null);

  useEffect(() => {
    if (map) {
      // Create simplified styling for the map
      const mapboxLayerOptions = {
        ...options,
        style: feature => {
          const layerName = feature.get('layer');

          if (layerName === 'water') {
            return new Style({
              fill: new Fill({
                color: '#ccd7f1',
              }),
            });
          } else if (layerName === 'landuse' || layerName === 'building') {
            return new Style({
              fill: new Fill({
                color: '#ffffff',
              }),
            });
          } else if (layerName === 'admin' || layerName === 'boundary') {
            return new Style({
              stroke: new Stroke({
                color: '#d9d9e0',
                width: 1,
              }),
            });
          } else if (layerName === 'road') {
            return new Style({
              stroke: new Stroke({
                color: '#f8f8fa',
                width: 1,
              }),
            });
          } else {
            return new Style({
              fill: new Fill({
                color: '#ffffff',
              }),
            });
          }
        },
      };

      mapboxLayer.current = new VectorTile(mapboxLayerOptions);
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
