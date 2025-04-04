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
} from '@floating-ui/react-dom-interactions';
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

export const MenuComponent = forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ children, renderButton, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [allowHover, setAllowHover] = useState(false);
    const cx = classNames.bind(styles);

    const listItemsRef = useRef([]);

    const { x, y, reference, floating, strategy, context } = useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [offset({ mainAxis: 8, alignmentAxis: 0 }), flip(), shift()],
      placement: 'bottom-start',
      whileElementsMounted: autoUpdate,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } =
      useInteractions([
        useClick(context),
        useRole(context, { role: 'menu' }),
        useDismiss(context),
        useListNavigation(context, {
          listRef: listItemsRef,
          activeIndex,
          onNavigate: setActiveIndex,
        }),
      ]);

    // Determine if "hover" logic can run based on the modality of input. This
    // prevents unwanted focus synchronization as menus open and close with
    // keyboard navigation and the cursor is resting on the menu.
    useEffect(() => {
      function onPointerMove() {
        setAllowHover(true);
      }

      function onKeyDown() {
        setAllowHover(false);
      }

      window.addEventListener('pointermove', onPointerMove, {
        once: true,
        capture: true,
      });
      window.addEventListener('keydown', onKeyDown, true);

      return () => {
        window.removeEventListener('pointermove', onPointerMove, {
          capture: true,
        });
        window.removeEventListener('keydown', onKeyDown, true);
      };
    }, [allowHover]);

    const mergedReferenceRef = useMemo(
      () => mergeRefs([ref, reference]),
      [reference, ref],
    );

    return (
      <div className={styles.container}>
        {renderButton(
          getReferenceProps({
            ...props,
            ref: mergedReferenceRef,
            onClick(event) {
              event.stopPropagation();
              event.currentTarget.focus();
            },
            className: cx({ button: true, open }),
          }),
        )}
        <FloatingPortal>
          {open && (
            <FloatingFocusManager
              context={context}
              preventTabbing
              modal
              // Touch-based screen readers will be able to navigate back to the
              // reference and click it to dismiss the menu without clicking an item.
              // This acts as a touch-based `Esc` key. A visually-hidden dismiss button
              // is an alternative.
              order={['reference', 'content']}
            >
              <div
                {...getFloatingProps({
                  className: styles.menuAdvanced,
                  ref: floating,
                  style: {
                    position: strategy,
                    top: y ? y : '',
                    left: x ? x : '',
                  },
                  onClick() {
                    setOpen(false);
                  },
                })}
              >
                {Children.map(children, (child, index) => {
                  if (isValidElement(child)) {
                    return cloneElement(
                      child,
                      getItemProps({
                        role: 'menuitem',
                        className: styles.menuItem,
                        ref(node) {
                          listItemsRef.current[index] = node;
                        },
                        onClick: child.props.onClick,
                        // By default `focusItemOnHover` uses `mousemove` to sync focus,
                        // but when a menu closes we want this to sync it on `enter`
                        // even if the cursor didn't move. NB: Safari does not sync in
                        // this case.
                        onPointerEnter() {
                          if (allowHover) {
                            setActiveIndex(index);
                          }
                        },
                      }),
                    );
                  }
                  return null;
                })}
              </div>
            </FloatingFocusManager>
          )}
        </FloatingPortal>
      </div>
    );
  },
);

export const Menu = forwardRef((props, ref) => {
  return <MenuComponent {...props} ref={ref} />;
});
