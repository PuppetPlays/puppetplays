import VectorLayer from 'ol/layer/Vector';
import { useEffect, useRef } from 'react';

import { useMap } from './mapContext';

const useVectorLayer = options => {
  const map = useMap();
  const vectorLayer = useRef(null);

  useEffect(() => {
    if (map) {
      vectorLayer.current = new VectorLayer(options);
      map.addLayer(vectorLayer.current);
    }

    return () => {
      if (map && vectorLayer.current) {
        map.removeLayer(vectorLayer.current);
      }
    };
  }, [map, options]);

  return vectorLayer;
};

export default useVectorLayer;
