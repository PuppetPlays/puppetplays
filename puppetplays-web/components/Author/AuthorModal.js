import { useCallback } from 'react';
import get from 'lodash/get';
import useTranslation from 'next-translate/useTranslation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { fetchAPI, getAuthorByIdQuery, getWorksOfAuthorQuery } from 'lib/api';
import {
  getMetaOfModalByType,
  isModalOfTypeOpen,
  modalTypes,
  useModal,
} from 'components/modalContext';
import AuthorNote from 'components/Author/AuthorNote';
import Modal from 'components/Modal';
import Author from 'components/Author';

function AuthorModal() {
  const { t } = useTranslation();
  const router = useRouter();
  const [modalState, dispatch] = useModal();
  const { id: authorId } = getMetaOfModalByType(modalState, modalTypes.author);

  const { data } = useSWR(
    isModalOfTypeOpen(modalState, modalTypes.author)
      ? [getAuthorByIdQuery, router.locale, authorId]
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
    isModalOfTypeOpen(modalState, modalTypes.author)
      ? [getWorksOfAuthorQuery, router.locale, authorId]
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
  const filteredWorks = isModalOfTypeOpen(modalState, modalTypes.author)
    ? works &&
      works.entries
        .filter(({ authors }) => authors && Array.isArray(authors) && authors.map(({ id }) => id).includes(authorId))
        // eslint-disable-next-line no-unused-vars
        .map(({ authors, ...entry }) => entry)
    : null;

  const handleCloseModal = useCallback(() => {
    dispatch({ type: 'close', payload: { type: modalTypes.author } });
  }, [dispatch]);

  return (
    <Modal
      modalType={modalTypes.author}
      isOpen={isModalOfTypeOpen(modalState, modalTypes.author)}
      title={data && <Author {...get(data, 'entry', {})} />}
      subtitle={t('common:author')}
    >
      {data && filteredWorks && (
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
