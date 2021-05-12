import get from 'lodash/get';
import isNil from 'lodash/isNil';
import useTranslation from 'next-translate/useTranslation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { fetchAPI, getAuthorByIdQuery, getWorksOfAuthorQuery } from 'lib/api';
import { modalTypes, useModal } from 'components/modalContext';
import AuthorNote from 'components/Author/AuthorNote';
import Modal from 'components/Modal';
import Author from 'components/Author';

const getAuthorId = (state) => {
  if (get(state, 'type', null) === modalTypes.author) {
    return get(state, 'meta.id', null);
  }
  return null;
};

function AuthorModal() {
  const { t } = useTranslation();
  const router = useRouter();
  const [modalState] = useModal();

  const { data } = useSWR(
    !isNil(modalState)
      ? [getAuthorByIdQuery, router.locale, getAuthorId(modalState)]
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
      ? [getWorksOfAuthorQuery, router.locale, getAuthorId(modalState)]
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
