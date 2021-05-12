import { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import useTranslation from 'next-translate/useTranslation';
import { useModal } from 'components/modalContext';
import styles from './modal.module.scss';
import { PageSubtitle, PageTitle } from 'components/Primitives';

function Modal({ isOpen, title, subtitle, children }) {
  const { t } = useTranslation();
  const [, dispatch] = useModal();

  const handleClose = useCallback(() => {
    dispatch({ type: 'close' });
  }, [dispatch]);

  return (
    <ReactModal
      isOpen={isOpen}
      aria={{
        labelledby: 'heading',
        describedby: 'description',
      }}
      onRequestClose={handleClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <header className={styles.header}>
        {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label={t('common:close')}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="2.13" y1="14" x2="14.13" y2="2" strokeLinecap="round" />
            <line x1="1.87" y1="2" x2="13.87" y2="13" strokeLinecap="round" />
          </svg>
        </button>
      </header>
      <div className={styles.content}>
        <PageTitle id="heading">{title}</PageTitle>
        <div className={styles.body} id="description">
          {children}
        </div>
      </div>
    </ReactModal>
  );
}

Modal.defaultProps = {
  title: '',
  subtitle: null,
  children: null,
};

Modal.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
  subtitle: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
};

export default Modal;
