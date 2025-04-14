/* eslint-disable react/display-name */
import classNames from 'classnames/bind';
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { mergeRefs } from 'react-merge-refs';

import styles from './dropdownMenu.module.scss';

export const MenuItem = forwardRef(
  ({ children, icon, disabled, ...props }, ref) => {
    return (
      <button {...props} ref={ref} role="menuitem" disabled={disabled}>
        {icon}
        <span>{children}</span>
      </button>
    );
  },
);

export const MenuComponent = forwardRef(
  ({ children, renderButton, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const cx = classNames.bind(styles);

    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    // Simple positioning logic
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    // Update position when open changes
    useEffect(() => {
      if (open && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + window.scrollY + 8, // Add offset similar to original
          left: rect.left + window.scrollX,
        });
      }
    }, [open]);

    // Close on outside click
    useEffect(() => {
      if (!open) return;

      const handleOutsideClick = e => {
        if (
          menuRef.current &&
          !menuRef.current.contains(e.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(e.target)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, [open]);

    // Close on Escape key
    useEffect(() => {
      const handleKeyDown = e => {
        if (e.key === 'Escape' && open) {
          setOpen(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [open]);

    const mergedReferenceRef = useMemo(
      () => mergeRefs([ref, buttonRef]),
      [ref],
    );

    const handleButtonClick = event => {
      event.stopPropagation();
      setOpen(!open);
    };

    return (
      <div className={styles.container}>
        {renderButton({
          ...props,
          ref: mergedReferenceRef,
          onClick: handleButtonClick,
          className: cx({ button: true, open }),
        })}

        {open && (
          <div
            ref={menuRef}
            className={styles.menuAdvanced}
            style={{
              position: 'absolute',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              zIndex: 1000,
            }}
          >
            {Children.map(children, (child, index) => {
              if (isValidElement(child)) {
                return cloneElement(child, {
                  className: styles.menuItem,
                  onClick: e => {
                    if (child.props.onClick) {
                      child.props.onClick(e);
                    }
                    setOpen(false);
                  },
                  role: 'menuitem',
                });
              }
              return null;
            })}
          </div>
        )}
      </div>
    );
  },
);

export const Menu = forwardRef((props, ref) => {
  return <MenuComponent {...props} ref={ref} />;
});
