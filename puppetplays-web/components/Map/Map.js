import { useRef } from 'react';
import PropTypes from 'prop-types';
import { MapProvider } from './mapContext';

const Map = ({ children, zoom, center, onClick }) => {
  const mapRef = useRef();

  return (
    <MapProvider zoom={zoom} center={center} mapRef={mapRef} onClick={onClick}>
      <div ref={mapRef} className="ol-map">
        {children}
      </div>
    </MapProvider>
  );
};

Map.propTypes = {
  children: PropTypes.node.isRequired,
  zoom: PropTypes.number.isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Map;
