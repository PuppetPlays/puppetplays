import get from 'lodash/get';
import useTranslation from 'next-translate/useTranslation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { fetchAPI, getAuthorByIdQuery, getWorksOfAuthorQuery } from 'lib/api';
import { modalTypes, useModal } from 'components/modalContext';
import AuthorNote from 'components/Author/AuthorNote';
import Modal from 'components/Modal';
import Author from 'components/Author';

function AuthorModal() {
  const { t } = useTranslation();
  const router = useRouter();
  const [modalState] = useModal();

  const { data } = useSWR(
    get(modalState, 'meta.id', null)
      ? [getAuthorByIdQuery, router.locale, modalState.meta.id]
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
      ? [getWorksOfAuthorQuery, router.locale, modalState.meta.id]
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
      isOpen={get(modalState, 'type', null) === modalTypes.author}
      title={data && <Author {...get(data, 'entry', {})} />}
      subtitle={t('common:author')}
    >
      {data && works && <AuthorNote works={works.entries} {...data.entry} />}
    </Modal>
  );
}

export default AuthorModal;
