import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

const ModalContext = React.createContext();

export const modalTypes = {
  author: 'AUTHOR_MODAL',
  animationTechnique: 'ANIMATION_TECHNIQUE_MODAL',
  image: 'IMAGE_MODAL',
};

function modalReducer(_, { type, payload }) {
  switch (type) {
    case 'open': {
      return {
        type: payload.type,
        meta: payload.meta,
      };
    }

    case 'close': {
      return null;
    }

    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

export const isModalOfTypeOpen = (state, type) =>
  get(state, 'type', null) === type;

export function ModalProvider({ children }) {
  const reducer = React.useReducer(modalReducer, null);

  return (
    <ModalContext.Provider value={reducer}>{children}</ModalContext.Provider>
  );
}

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useModal() {
  const context = React.useContext(ModalContext);

  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
}
