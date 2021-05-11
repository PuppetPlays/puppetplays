import React from 'react';
import PropTypes from 'prop-types';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import classNames from 'classnames/bind';
import styles from './dropdownMenu.module.scss';

const cx = classNames.bind(styles);

function DropdownMenu({ itemsCount, children }) {
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(itemsCount);
  const menuClassNames = cx({
    menu: true,
    isOpen: isOpen,
  });

  return (
    <div className={styles.container}>
      <button {...buttonProps}>
        <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6.5L0.5 1.5L7.5 1.5L4 6.5Z" />
        </svg>
      </button>
      <div className={menuClassNames} role="menu">
        {React.Children.map(children, (child, index) => (
          <div {...itemProps[index]}>{child}</div>
        ))}
      </div>
    </div>
  );
}

DropdownMenu.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  children: PropTypes.array.isRequired,
};

export default DropdownMenu;

export function DropdownMenuItem({ icon, children, onClick }) {
  return (
    <button type="button" className={styles.menuItem} onClick={onClick}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

DropdownMenuItem.propTypes = {
  icon: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};
