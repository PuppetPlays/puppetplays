import get from 'lodash/get';
import useTranslation from 'next-translate/useTranslation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { fetchAPI, getAuthorByIdQuery, getWorksOfAuthorQuery } from 'lib/api';
import { hasAtLeastOneItem } from 'lib/utils';
import { modalTypes, useModal } from 'components/modalContext';
import Modal from 'components/Modal';
import Author from 'components/Author';
import Figure from 'components/Figure';
import Hypotext from 'components/Hypotext';
import Section from 'components/Section';
import Info from 'components/Info';
import styles from './authorModal.module.scss';

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
      {data && data.entry && (
        <div>
          <div className={styles.dates}>
            {data.entry.birthDate} – {data.entry.deathDate}
          </div>
          <div
            className={styles.biographicalNote}
            dangerouslySetInnerHTML={{
              __html: get(data, 'entry.biographicalNote', ''),
            }}
          />
          {hasAtLeastOneItem(data.entry.mainImage) && (
            <Figure {...data.entry.mainImage[0]} />
          )}
        </div>
      )}

      {works && (
        <div className={styles.works}>
          <h3 className={styles.intertitle}>{t('common:works')}</h3>
          {works.entries.map((entry) => (
            <div key={entry.id}>
              <Hypotext {...entry} />
            </div>
          ))}
        </div>
      )}

      {data && data.entry && (
        <Section
          title={t('common:ids')}
          show={
            !!data.entry.idrefId ||
            !!data.entry.viafId ||
            !!data.entry.arkId ||
            !!data.entry.isniId
          }
        >
          <Info label="ARK" show={!!data.entry.arkId}>
            {data.entry.arkId}
          </Info>
          <Info label="VIAF" show={!!data.entry.viafId}>
            {data.entry.viafId}
          </Info>
          <Info label="IDREF" show={!!data.entry.idrefId}>
            {data.entry.idrefId}
          </Info>
          <Info label="ISNI" show={!!data.entry.isniId}>
            {data.entry.isniId}
          </Info>
        </Section>
      )}
    </Modal>
  );
}

export default AuthorModal;
