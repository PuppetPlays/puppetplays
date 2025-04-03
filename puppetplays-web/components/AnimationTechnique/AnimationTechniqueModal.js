import get from 'lodash/get';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import {
  fetchAPI,
  getAnimationTechniqueByIdQuery,
  getWorksOfAnimationTechniqueQuery,
} from 'lib/api';
import {
  getMetaOfModalByType,
  isModalOfTypeOpen,
  modalTypes,
  useModal,
} from 'components/modalContext';

import AnimationTechniqueNote from 'components/AnimationTechnique/AnimationTechniqueNote';
import Modal from 'components/Modal';
import useSafeData from 'hooks/useSafeData';
import LoadingSpinner from 'components/LoadingSpinner';
import ErrorMessage from 'components/ErrorMessage';
import { handleApiError } from 'lib/apiErrorHandler';

function AnimationTechniqueModal() {
  const { t } = useTranslation();
  const router = useRouter();
  const [modalState, dispatch] = useModal();
  const { id: animationTechniqueId } =
    getMetaOfModalByType(modalState, modalTypes.animationTechnique) || {};

  const isOpen = isModalOfTypeOpen(modalState, modalTypes.animationTechnique);
  const queryKey = isOpen
    ? [getAnimationTechniqueByIdQuery, router.locale, animationTechniqueId]
    : null;

  const fetcher = async (query, locale, id) => {
    try {
      return await fetchAPI(query, {
        variables: {
          locale,
          id,
        },
      });
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const {
    safeData: data,
    error: techError,
    isLoading: techLoading,
    mutate: mutateTech,
  } = useSafeData(queryKey, fetcher);

  const {
    safeData: works,
    error: worksError,
    isLoading: worksLoading,
    mutate: mutateWorks,
  } = useSafeData(
    isOpen
      ? [getWorksOfAnimationTechniqueQuery, router.locale, animationTechniqueId]
      : null,
    fetcher,
  );

  const handleCloseModal = useCallback(() => {
    dispatch({
      type: 'close',
      payload: { type: modalTypes.animationTechnique },
    });
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    mutateTech();
    mutateWorks();
  }, [mutateTech, mutateWorks]);

  const isLoading = techLoading || worksLoading;
  const error = techError || worksError;
  const title = get(data, 'entry.title', '');
  const hasData = data.entry && works.entries;

  return (
    <Modal
      modalType={modalTypes.animationTechnique}
      isOpen={isOpen}
      title={title || t('common:animationTechnique')}
      subtitle={title ? t('common:animationTechnique') : ''}
    >
      {isLoading && <LoadingSpinner text={t('common:loading')} />}

      {error && (
        <ErrorMessage error={error} onRetry={handleRetry} className="m-4" />
      )}

      {!isLoading && !error && hasData && (
        <AnimationTechniqueNote
          works={works.entries || []}
          onCloseModal={handleCloseModal}
          {...data.entry}
        />
      )}
    </Modal>
  );
}

export default AnimationTechniqueModal;
