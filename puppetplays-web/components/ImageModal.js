import {
  getMetaOfModalByType,
  isModalOfTypeOpen,
  modalTypes,
  useModal,
} from 'components/modalContext';
import Modal from 'components/Modal';
import styles from './ImageModal.module.scss';

function ImageModal() {
  const [modalState] = useModal();
  const { content } = getMetaOfModalByType(modalState, modalTypes.image);
  const isModalOpen = isModalOfTypeOpen(modalState, modalTypes.image);

  return (
    <Modal
      modalType={modalTypes.image}
      isOpen={isModalOpen}
      scrollElement="modal"
    >
      <div className={styles.container}>{content}</div>
    </Modal>
  );
}

export default ImageModal;
