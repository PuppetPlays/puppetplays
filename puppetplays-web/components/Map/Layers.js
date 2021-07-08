import PropTypes from 'prop-types';
import useVectorLayer from './useVectorLayer';
import useMapboxLayer from './useMapboxLayer';
import { getPlaceStyle } from './styles';
import { useRef } from 'react';

const Layers = ({ byCountrySource, byPlaceSource, children }) => {
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
    styleUrl: 'mapbox://styles/tpaillot/ckq9hgnpk23wl17qkyc24ybjc',
    accessToken:
      'pk.eyJ1IjoidHBhaWxsb3QiLCJhIjoiY2txOTY4cmd3MDA5YjJvcGlpNGt4aTF4MCJ9.wfMlWQiXo_BGWYR1OJL9bQ',
    zIndex: 1,
    declutter: false,
  });
  useMapboxLayer(mapboxSourceOption.current);
  useVectorLayer(placeSourceOption.current);
  useVectorLayer(countrySourceOption.current);

  return <div>{children}</div>;
};

Layers.defaultProps = {
  children: null,
};

Layers.propTypes = {
  byCountrySource: PropTypes.object.isRequired,
  byPlaceSource: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default Layers;
