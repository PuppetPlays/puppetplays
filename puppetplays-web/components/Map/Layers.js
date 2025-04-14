import MVT from 'ol/format/MVT';
import VectorTileSource from 'ol/source/VectorTile';
import PropTypes from 'prop-types';
import { useRef } from 'react';

import { getPlaceStyle } from './styles';
import useMapboxLayer from './useMapboxLayer';
import useVectorLayer from './useVectorLayer';

const Layers = ({
  byCountrySource = null,
  byPlaceSource = null,
  children = null,
}) => {
  const placeSourceOption = useRef({
    source: byPlaceSource,
    style: getPlaceStyle,
    minZoom: 5,
    zIndex: 10000,
  });
  const countrySourceOption = useRef({
    source: byCountrySource,
    style: getPlaceStyle,
    maxZoom: 5,
    zIndex: 20000,
  });
  const mapboxSourceOption = useRef({
    source: new VectorTileSource({
      url: 'https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoidHBhaWxsb3QiLCJhIjoiY2txOTY4cmd3MDA5YjJvcGlpNGt4aTF4MCJ9.wfMlWQiXo_BGWYR1OJL9bQ',
      format: new MVT(),
      maxZoom: 19,
    }),
    zIndex: 1,
    declutter: false,
  });
  useMapboxLayer(mapboxSourceOption.current);
  useVectorLayer(placeSourceOption.current);
  useVectorLayer(countrySourceOption.current);

  return <div>{children}</div>;
};

Layers.propTypes = {
  byCountrySource: PropTypes.object.isRequired,
  byPlaceSource: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default Layers;
