import get from 'lodash/get';
import useTranslation from 'next-translate/useTranslation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import {
  fetchAPI,
  getAnimationTechniqueByIdQuery,
  getWorksOfAnimationTechniqueQuery,
} from 'lib/api';
import {
  isModalOfTypeOpen,
  modalTypes,
  useModal,
} from 'components/modalContext';
import AnimationTechniqueNote from 'components/AnimationTechnique/AnimationTechniqueNote';
import Modal from 'components/Modal';

function AnimationTechniqueModal() {
  const { t } = useTranslation();
  const router = useRouter();
  const [modalState] = useModal();

  const { data } = useSWR(
    isModalOfTypeOpen(modalState, modalTypes.animationTechnique)
      ? [
          getAnimationTechniqueByIdQuery,
          router.locale,
          get(modalState, 'meta.id', null),
        ]
      : null,
    (query, locale, id) => {
      return fetchAPI(query, {
        variables: {
          locale,
          id,
        },
      });
    },
  );
  const { data: works } = useSWR(
    isModalOfTypeOpen(modalState, modalTypes.animationTechnique)
      ? [
          getWorksOfAnimationTechniqueQuery,
          router.locale,
          get(modalState, 'meta.id', null),
        ]
      : null,
    (query, locale, id) => {
      return fetchAPI(query, {
        variables: {
          locale,
          id,
        },
      });
    },
  );

  return (
    <Modal
      isOpen={isModalOfTypeOpen(modalState, modalTypes.animationTechnique)}
      title={data && get(data, 'entry.title', '')}
      subtitle={t('common:animationTechnique')}
    >
      {data && works && (
        <AnimationTechniqueNote works={works.entries} {...data.entry} />
      )}
    </Modal>
  );
}

export default AnimationTechniqueModal;
