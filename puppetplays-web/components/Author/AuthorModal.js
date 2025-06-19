import Author from 'components/Author';
import AuthorNote from 'components/Author/AuthorNote';
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
import { fetchAPI, getAuthorByIdQuery, getWorksOfAuthorQuery } from 'lib/api';
import { handleApiError } from 'lib/apiErrorHandler';
import get from 'lodash/get';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';

function AuthorModal() {
  const { t } = useTranslation();
  const router = useRouter();
  const [modalState, dispatch] = useModal();
  const isOpen = isModalOfTypeOpen(modalState, modalTypes.author);
  const meta = getMetaOfModalByType(modalState, modalTypes.author) || {};
  const authorId = meta.id;

  const queryKey =
    isOpen && authorId ? [getAuthorByIdQuery, router.locale, authorId] : null;

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
    error: authorError,
    isLoading: authorLoading,
    mutate: mutateAuthor,
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
    isOpen ? [getWorksOfAuthorQuery, router.locale, authorId] : null,
    fetcher,
    {
      revalidateOnMount: true,
      dedupingInterval: 0, // Disable deduping to force fresh fetch
    },
  );

  const filteredWorks =
    isOpen && works.entries
      ? works.entries
          .filter(
            ({ authors }) =>
              authors &&
              Array.isArray(authors) &&
              authors.map(({ id }) => id).includes(authorId),
          )
          // eslint-disable-next-line no-unused-vars
          .map(({ authors, ...entry }) => entry)
      : null;

  const handleCloseModal = useCallback(() => {
    dispatch({
      type: 'close',
      payload: { type: modalTypes.author },
    });
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    mutateAuthor();
    mutateWorks();
  }, [mutateAuthor, mutateWorks]);

  const isLoading = authorLoading || worksLoading;
  const error = authorError || worksError;
  const title = get(data, 'entry', {});
  const hasData = data.entry && filteredWorks;

  return (
    <Modal
      modalType={modalTypes.author}
      isOpen={isOpen}
      title={data && <Author {...title} />}
      subtitle={t('common:author')}
    >
      {isLoading && <LoadingSpinner text={t('common:loading')} />}

      {error && (
        <ErrorMessage error={error} onRetry={handleRetry} className="m-4" />
      )}

      {!isLoading && !error && hasData && (
        <AuthorNote
          works={filteredWorks}
          onCloseModal={handleCloseModal}
          {...data.entry}
        />
      )}
    </Modal>
  );
}

export default AuthorModal;
