import AnimationTechniqueNote from 'components/AnimationTechnique/AnimationTechniqueNote';
import ErrorMessage from 'components/ErrorMessage';
import LoadingSpinner from 'components/LoadingSpinner';
import Modal from 'components/Modal';
import {
  getMetaOfModalByType,
  isModalOfTypeOpen,
  modalTypes,
  useModal,
} from 'components/modalContext';
import useSafeData from 'hooks/useSafeData';
import {
  fetchAPI,
  getAnimationTechniqueByIdQuery,
  getWorksOfAnimationTechniqueQuery,
} from 'lib/api';
import { handleApiError } from 'lib/apiErrorHandler';
import get from 'lodash/get';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';

function AnimationTechniqueModal() {
  const { t } = useTranslation();
  const router = useRouter();
  const [modalState, dispatch] = useModal();
  const meta =
    getMetaOfModalByType(modalState, modalTypes.animationTechnique) || {};
  const animationTechniqueId = meta.id;

  const isOpen = isModalOfTypeOpen(modalState, modalTypes.animationTechnique);

  const queryKey =
    isOpen && animationTechniqueId
      ? [getAnimationTechniqueByIdQuery, router.locale, animationTechniqueId]
      : null;

  const fetcher = async key => {
    const [query, locale, id] = key;

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
  } = useSafeData(queryKey, fetcher, {
    revalidateOnMount: true,
    dedupingInterval: 0, // Disable deduping to force fresh fetch
  });

  const {
    safeData: works,
    error: worksError,
    isLoading: worksLoading,
    mutate: mutateWorks,
  } = useSafeData(
    isOpen && animationTechniqueId
      ? [getWorksOfAnimationTechniqueQuery, router.locale, animationTechniqueId]
      : null,
    fetcher,
    {
      revalidateOnMount: true,
      dedupingInterval: 0, // Disable deduping to force fresh fetch
    },
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
