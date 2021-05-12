import get from 'lodash/get';
import isNil from 'lodash/isNil';
import useTranslation from 'next-translate/useTranslation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import {
  fetchAPI,
  getAnimationTechniqueByIdQuery,
  getWorksOfAnimationTechniqueQuery,
} from 'lib/api';
import { modalTypes, useModal } from 'components/modalContext';
import AnimationTechniqueNote from 'components/AnimationTechnique/AnimationTechniqueNote';
import Modal from 'components/Modal';

const getAnimationTechniqueId = (state) => {
  if (get(state, 'type', null) === modalTypes.author) {
    return get(state, 'meta.id', null);
  }
  return null;
};

function AnimationTechniqueModal() {
  const { t } = useTranslation();
  const router = useRouter();
  const [modalState] = useModal();

  const { data } = useSWR(
    !isNil(modalState)
      ? [
          getAnimationTechniqueByIdQuery,
          router.locale,
          getAnimationTechniqueId(modalState),
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
    !isNil(modalState)
      ? [
          getWorksOfAnimationTechniqueQuery,
          router.locale,
          getAnimationTechniqueId(modalState),
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
      isOpen={get(modalState, 'type', null) === modalTypes.animationTechnique}
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
