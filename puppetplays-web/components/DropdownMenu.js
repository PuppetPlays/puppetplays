import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import classNames from 'classnames/bind';
import styles from './dropdownMenu.module.scss';

const cx = classNames.bind(styles);

// eslint-disable-next-line react/prop-types
const DefaultWrapper = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

function DropdownMenu({
  itemsCount,
  renderButton,
  children,
  childrenWrapperComponent: ChildrenWrapperComponent,
}) {
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(itemsCount);
  const menuClassNames = cx({
    menu: true,
    isOpen: isOpen,
  });

  return (
    <div className={styles.container}>
      {renderButton(buttonProps)}
      <div className={menuClassNames} role="menu">
        <ChildrenWrapperComponent>
          {React.Children.map(children, (child, index) => (
            <div {...itemProps[index]}>{child}</div>
          ))}
        </ChildrenWrapperComponent>
      </div>
    </div>
  );
}

DropdownMenu.defaultProps = {
  childrenWrapperComponent: DefaultWrapper,
};

DropdownMenu.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  renderButton: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
  childrenWrapperComponent: PropTypes.func,
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
