module.exports = function useDropdownMenu(itemsCount) {
  return {
    buttonProps: {
      'aria-haspopup': 'menu',
      'aria-expanded': false,
      onClick: jest.fn(),
      onKeyDown: jest.fn(),
    },
    itemProps: Array(itemsCount).fill({}).map(() => ({
      role: 'menuitem',
      tabIndex: -1,
      onKeyDown: jest.fn(),
      onClick: jest.fn(),
    })),
    isOpen: false,
    setIsOpen: jest.fn(),
    moveFocus: jest.fn(),
  };
}; 