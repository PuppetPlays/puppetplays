import get from 'lodash/get';
import {
  isModalOfTypeOpen,
  modalTypes,
  useModal,
} from 'components/modalContext';
import Modal from 'components/Modal';
import styles from './ImageModal.module.scss';

function ImageModal() {
  const [modalState] = useModal();

  return (
    <Modal
      isOpen={isModalOfTypeOpen(modalState, modalTypes.image)}
      scrollElement="modal"
    >
      <div className={styles.container}>
        {get(modalState, 'meta.content', null)}
      </div>
    </Modal>
  );
}

export default ImageModal;
