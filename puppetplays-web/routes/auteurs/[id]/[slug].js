import Head from 'next/head';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import useTranslation from 'next-translate/useTranslation';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import { fetchAPI, getAuthorByIdQuery, getWorksOfAuthorQuery } from 'lib/api';
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
        style={{ maxWidth: 678, padding: '62px 0', textAlign: 'center' }}
      >
        <PageSubtitle>{t('common:author')}</PageSubtitle>
        {authorData && (
          <PageTitle>
            <Author {...get(authorData, 'entry', {})} />
          </PageTitle>
        )}

        {authorData && authorWorksData && (
          <AuthorNote {...authorData.entry} works={authorWorksData.entries} />
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
  const authorData = await fetchAPI(
    getAuthorByIdQuery,
    {
      variables: { locale, id: params.id },
    },
    token,
  );
  const authorWorksData = await fetchAPI(
    getWorksOfAuthorQuery,
    {
      variables: { locale, id: params.id },
    },
    token,
  );

  return {
    props: { authorData, authorWorksData },
  };
}
