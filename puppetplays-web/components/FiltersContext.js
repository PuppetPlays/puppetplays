import React from 'react';
import PropTypes from 'prop-types';

const FiltersContext = React.createContext();

export function FiltersProvider({ children, isOpen }) {
  return (
    <FiltersContext.Provider value={isOpen}>{children}</FiltersContext.Provider>
  );
}

FiltersProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export function useFilters() {
  const context = React.useContext(FiltersContext);

  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }

  return context;
}
