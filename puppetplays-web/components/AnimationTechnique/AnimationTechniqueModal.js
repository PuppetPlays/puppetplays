import get from 'lodash/get';
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
import Author from 'components/Author';

function AnimationTechniqueModal() {
  const { t } = useTranslation();
  const router = useRouter();
  const [modalState] = useModal();

  const { data } = useSWR(
    get(modalState, 'meta.id', null)
      ? [getAnimationTechniqueByIdQuery, router.locale, modalState.meta.id]
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
    get(modalState, 'meta.id', null)
      ? [getWorksOfAnimationTechniqueQuery, router.locale, modalState.meta.id]
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
