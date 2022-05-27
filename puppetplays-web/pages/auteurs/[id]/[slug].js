import Head from 'next/head';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import useTranslation from 'next-translate/useTranslation';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import {
  getAuthorByIdQuery,
  getFetchAPIClient,
  getWorksOfAuthorQuery,
} from 'lib/api';
import Layout from 'components/Layout';
import Author from 'components/Author';
import { PageSubtitle, PageTitle } from 'components/Primitives';
import ContentLayout from 'components/ContentLayout';
import AuthorNote from 'components/Author/AuthorNote';

const AuthorPage = ({ authorData, authorWorksData }) => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Head>
        <title>{authorData.entry.title} | Puppetplays</title>
      </Head>
      <ContentLayout
        style={{ maxWidth: 678, padding: '62px 20px', textAlign: 'center' }}
      >
        <PageSubtitle>{t('common:author')}</PageSubtitle>
        {authorData && (
          <PageTitle>
            <Author {...get(authorData, 'entry', {})} />
          </PageTitle>
        )}

        {authorData && authorWorksData && (
          <AuthorNote
            {...authorData.entry}
            works={authorWorksData.entries}
            bleedCarousel
          />
        )}
      </ContentLayout>
    </Layout>
  );
};

AuthorPage.propTypes = {
  authorData: PropTypes.object.isRequired,
  authorWorksData: PropTypes.object.isRequired,
};

export default AuthorPage;

export async function getServerSideProps({ locale, req, res, params, query }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useCraftAuthMiddleware(req, res, locale);

  const token = query && query.token;
  const apiClient = getFetchAPIClient({
    variables: { locale, id: params.id },
    token,
  });
  const [authorData, authorWorksData] = await Promise.all([
    apiClient(getAuthorByIdQuery),
    apiClient(getWorksOfAuthorQuery),
  ]);

  authorWorksData.entries = authorWorksData.entries
    .filter(({ authors }) => authors.map(({ id }) => id).includes(params.id))
    .map(({ authors, ...entry }) => entry);

  return {
    props: { authorData, authorWorksData },
  };
}
