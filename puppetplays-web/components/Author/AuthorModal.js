import get from 'lodash/get';
import useTranslation from 'next-translate/useTranslation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { fetchAPI, getAuthorByIdQuery, getWorksOfAuthorQuery } from 'lib/api';
import {
  isModalOfTypeOpen,
  modalTypes,
  useModal,
} from 'components/modalContext';
import AuthorNote from 'components/Author/AuthorNote';
import Modal from 'components/Modal';
import Author from 'components/Author';
import { useCallback } from 'react';

function AuthorModal() {
  const { t } = useTranslation();
  const router = useRouter();
  const [modalState, dispatch] = useModal();

  const { data } = useSWR(
    isModalOfTypeOpen(modalState, modalTypes.author)
      ? [getAuthorByIdQuery, router.locale, get(modalState, 'meta.id', null)]
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
      ? [getWorksOfAuthorQuery, router.locale, get(modalState, 'meta.id', null)]
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

  const handleCloseModal = useCallback(() => {
    dispatch({ type: 'close' });
  }, [dispatch]);

  return (
    <Modal
      isOpen={isModalOfTypeOpen(modalState, modalTypes.author)}
      title={data && <Author {...get(data, 'entry', {})} />}
      subtitle={t('common:author')}
    >
      {data && works && (
        <AuthorNote
          works={works.entries}
          onCloseModal={handleCloseModal}
          {...data.entry}
        />
      )}
    </Modal>
  );
}

export default AuthorModal;
