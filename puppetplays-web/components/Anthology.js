import Author from 'components/Author';
import CommaSepList from 'components/CommaSepList';
import Info from 'components/Info';
import Section from 'components/Section';
import { hasAtLeastOneItem } from 'lib/utils';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import WorkHeader from './Work/WorkHeader';
import styles from './Work/workSummary.module.scss';

function Anthology({
  id = null,
  slug = null,
  title = null,
  editors = [],
  transcribers = [],
  license = null,
  doi = null,
  nakalaViewerUrl = null,
  currentPage = 1,
  nakalaFiles = [],
  onPageChange = null,
}) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [permalinkUrl, setPermalinkUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPermalinkUrl(window.location.href);
    }
  }, []);

  // Ensure editors and transcribers are arrays
  const editorsArray = Array.isArray(editors) ? editors : [];
  const transcribersArray = Array.isArray(transcribers) ? transcribers : [];

  if (!title) {
    return (
      <div className={styles.container}>
        <p>{t('common:error.dataNotFound')}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>
          {title} - {t('anthology:title')}
        </title>
        <link rel="canonical" href={permalinkUrl} />
        <link rel="schema.DC" href="http://purl.org/dc/elements/1.1/" />
        <link rel="schema.DCTERMS" href="http://purl.org/dc/terms/" />
        <meta name="DC.title" lang={locale} content={title} />
        {editorsArray &&
          editorsArray.map(editor => (
            <meta
              key={`${editor.id}-DC`}
              name="DC.creator"
              content={editor.title}
            />
          ))}
        <meta name="DC.identifier" scheme="DCTERMS.URI" content={doi} />
        <meta name="DC.format" scheme="DCTERMS.IMT" content="text/html" />
        <meta name="DC.type" scheme="DCTERMS.DCMIType" content="Text" />
        <meta name="DC.publisher" content="Puppetplays" />
      </Head>

      <div className={styles.media}>
        <div
          style={{
            minHeight: '100px',
            background: 'var(--color-bg-depth-1)',
            borderRadius: '4px',
          }}
        >
          {/* Could add anthology cover image here in the future */}
        </div>
      </div>

      <div className={styles.body}>
        <WorkHeader
          title={title}
          authors={editorsArray}
          mostRelevantDate={null}
          compositionPlace={[]}
          translatedTitle={null}
        />

        <section>
          <Info
            label={t('anthology:compiler')}
            show={hasAtLeastOneItem(editorsArray)}
          >
            <CommaSepList list={editorsArray} itemComponent={Author} />
          </Info>

          <Info
            label={t('anthology:transcriber')}
            show={hasAtLeastOneItem(transcribersArray)}
          >
            <CommaSepList list={transcribersArray} itemComponent={Author} />
          </Info>

          <Info label={t('anthology:license')} show={!!license}>
            {license}
          </Info>
        </section>

        {nakalaViewerUrl && (
          <Section title={t('anthology:digitalizedDocument')}>
            <div style={{ marginBottom: '20px' }}>
              <iframe
                src={nakalaViewerUrl}
                title={`${t('anthology:digitalizedDocument')} - ${t('anthology:page')} ${currentPage}`}
                style={{
                  width: '100%',
                  height: '600px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                }}
              />
            </div>
          </Section>
        )}
      </div>

      <div className={styles.extra}>{/* Additional content can go here */}</div>
    </div>
  );
}

Anthology.propTypes = {
  id: PropTypes.string,
  slug: PropTypes.string,
  title: PropTypes.string,
  editors: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  transcribers: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  license: PropTypes.string,
  doi: PropTypes.string,
  nakalaViewerUrl: PropTypes.string,
  currentPage: PropTypes.number,
  nakalaFiles: PropTypes.array,
  onPageChange: PropTypes.func,
};

export default Anthology;
