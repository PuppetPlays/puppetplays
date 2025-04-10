import { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { useTranslation } from 'next-i18next';
import { modalTypes, useModal } from 'components/modalContext';
import { PageSubtitle, PageTitle } from 'components/Primitives';
import styles from './modal.module.scss';

function Modal({
  modalType = null,
  isOpen = false,
  title = null,
  subtitle = null,
  scrollElement = 'body',
  children = null,
}) {
  const modalContentRef = useRef(null);
  const { t } = useTranslation();
  const [, dispatch] = useModal();

  const handleClose = useCallback(() => {
    dispatch({ type: 'close', payload: { type: modalType } });
  }, [dispatch, modalType]);

  const setModalContentRef = useCallback(
    node => {
      modalContentRef.current = node;
    },
    [modalContentRef],
  );

  useEffect(() => {
    setTimeout(() => {
      if (modalContentRef.current && isOpen) {
        modalContentRef.current.style.marginTop = `${Math.max(
          0,
          (window.innerHeight - modalContentRef.current.offsetHeight) / 2,
        )}px`;
      }
    }, 100);
  }, [modalContentRef, isOpen]);

  return (
    <ReactModal
      isOpen={isOpen}
      aria={{
        labelledby: 'heading',
        describedby: 'description',
      }}
      onRequestClose={handleClose}
      className={`${styles.modal} modal ${styles[`is-${modalType}`]}`}
      overlayClassName={`${styles.overlay} ${
        styles[`has-${scrollElement}-scroll`]
      }`}
      contentRef={setModalContentRef}
    >
      <button
        type="button"
        className={styles.closeButton}
        onClick={handleClose}
        aria-label={t('common:close')}
      >
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="2.13" y1="14" x2="14.13" y2="2" strokeLinecap="round" />
          <line x1="1.87" y1="2" x2="13.87" y2="13" strokeLinecap="round" />
        </svg>
      </button>
      {subtitle && (
        <header className={styles.header}>
          <PageSubtitle>{subtitle}</PageSubtitle>
        </header>
      )}
      <div className={styles.content}>
        {title && <PageTitle id="heading">{title}</PageTitle>}
        <div className={styles.body} id="description">
          {children}
        </div>
      </div>
    </ReactModal>
  );
}

Modal.propTypes = {
  modalType: PropTypes.oneOf(Object.values(modalTypes)).isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  subtitle: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  scrollElement: PropTypes.oneOf(['modal', 'body']),
};

export default Modal;
