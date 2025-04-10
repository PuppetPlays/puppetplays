import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import styles from './dropdownMenu.module.scss';

// eslint-disable-next-line react/prop-types
const DefaultWrapper = React.forwardRef(({ children }, ref) => {
  return <Fragment ref={ref}>{children}</Fragment>;
});

DefaultWrapper.displayName = 'DefaultWrapper';

function DropdownMenu({
  itemsCount,
  renderButton,
  children,
  childrenWrapperComponent: ChildrenWrapperComponent = DefaultWrapper,
}) {
  const { buttonProps, itemProps, isOpen, setIsOpen } =
    useDropdownMenu(itemsCount);

  return (
    <div className={styles.container}>
      {renderButton(buttonProps)}
      {isOpen && (
        /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus */
        <div
          className={styles.menu}
          role="menu"
          onClick={() => setIsOpen(false)}
        >
          <ChildrenWrapperComponent>
            {React.Children.map(children, (child, index) => (
              <div {...itemProps[index]}>{child}</div>
            ))}
          </ChildrenWrapperComponent>
        </div>
      )}
    </div>
  );
}

DropdownMenu.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  renderButton: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
  childrenWrapperComponent: PropTypes.elementType,
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
