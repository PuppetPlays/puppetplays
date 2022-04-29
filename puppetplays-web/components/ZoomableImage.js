import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { modalTypes, useModal } from 'components/modalContext';

function ZoomableImage({ children }) {
  const [, dispatch] = useModal();

  const openImage = useCallback(() => {
    dispatch({
      type: 'openAbove',
      payload: { type: modalTypes.image, meta: { content: children } },
    });
  }, [dispatch, children]);

  return (
    <div onClick={openImage} role="presentation" style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
}

ZoomableImage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ZoomableImage;
