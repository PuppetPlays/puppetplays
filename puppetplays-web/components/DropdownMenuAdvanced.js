/* eslint-disable react/display-name */
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
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useListNavigation,
  useInteractions,
  useRole,
  useClick,
  useDismiss,
  FloatingPortal,
  FloatingFocusManager,
} from '@floating-ui/react';
import classNames from 'classnames/bind';
import { mergeRefs } from 'react-merge-refs';
import styles from './dropdownMenu.module.scss';

export const MenuItem = forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ children, icon, disabled, ...props }, ref) => {
    return (
      <button {...props} ref={ref} role="menuitem" disabled={disabled}>
        {icon}
        <span>{children}</span>
      </button>
    );
  },
);

MenuItem.displayName = 'MenuItem';

export const MenuComponent = forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ children, renderButton }, ref) => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [_allowHover, _setAllowHover] = useState(false);
    const cx = classNames.bind(styles);

    const listItemsRef = useRef([]);
    const listRef = useRef(null);
    const buttonRef = useRef(null);

    const { x, y, strategy, refs, context } = useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [offset(5), flip(), shift()],
      whileElementsMounted: autoUpdate,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      useClick(context),
      useDismiss(context),
      useRole(context),
      useListNavigation(context, {
        listRef,
        activeIndex,
        onNavigate: setActiveIndex,
        virtual: true,
        loop: true,
      }),
    ]);

    useEffect(() => {
      if (open) {
        setActiveIndex(null);
      }
    }, [open]);

    const mergedRefs = useMemo(
      () => mergeRefs([refs.setReference, buttonRef]),
      [refs.setReference],
    );

    const mergedListRefs = useMemo(
      () => mergeRefs([refs.setFloating, listRef, ref]),
      [refs.setFloating, ref],
    );

    return (
      <>
        {renderButton({
          ref: mergedRefs,
          ...getReferenceProps(),
        })}
        <FloatingPortal>
          {open && (
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={mergedListRefs}
                className={cx('menu', { open })}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                }}
                {...getFloatingProps()}
              >
                {Children.map(children, (child, index) => {
                  if (isValidElement(child)) {
                    return cloneElement(child, {
                      ...getItemProps({
                        ref: node => {
                          listItemsRef.current[index] = node;
                        },
                        onPointerEnter() {
                          if (_allowHover) {
                            setActiveIndex(index);
                          }
                        },
                      }),
                    });
                  }
                  return child;
                })}
              </div>
            </FloatingFocusManager>
          )}
        </FloatingPortal>
      </>
    );
  },
);

MenuComponent.displayName = 'MenuComponent';

export default MenuComponent;
