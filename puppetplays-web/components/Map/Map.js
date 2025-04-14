import PropTypes from 'prop-types';
import { useRef } from 'react';

import { MapProvider } from './mapContext';

const Map = ({ children, zoom, center, onClick, setSelectInteraction }) => {
  const mapRef = useRef();

  return (
    <MapProvider
      zoom={zoom}
      center={center}
      mapRef={mapRef}
      onClick={onClick}
      setSelectInteraction={setSelectInteraction}
    >
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
  setSelectInteraction: PropTypes.func.isRequired,
};

export default Map;
