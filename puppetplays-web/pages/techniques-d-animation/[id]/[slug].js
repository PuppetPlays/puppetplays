import Head from 'next/head';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import useTranslation from 'next-translate/useTranslation';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import {
  fetchAPI,
  getAnimationTechniqueByIdQuery,
  getWorksOfAnimationTechniqueQuery,
} from 'lib/api';
import Layout from 'components/Layout';
import { PageSubtitle, PageTitle } from 'components/Primitives';
import ContentLayout from 'components/ContentLayout';
import AnimationTechniqueNote from 'components/AnimationTechnique/AnimationTechniqueNote';

const AnimationTechniquesPage = ({
  animationTechniquesData,
  animationTechniquesWorksData,
}) => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Head>
        <title>{animationTechniquesData.entry.title} | Puppetplays</title>
      </Head>
      <ContentLayout
        style={{ maxWidth: 678, padding: '62px 20px', textAlign: 'center' }}
      >
        <PageSubtitle>{t('common:animationTechniques')}</PageSubtitle>
        {animationTechniquesData && (
          <PageTitle>
            {get(animationTechniquesData, 'entry.title', '')}
          </PageTitle>
        )}
        {animationTechniquesData && animationTechniquesWorksData && (
          <AnimationTechniqueNote
            {...animationTechniquesData.entry}
            works={animationTechniquesWorksData.entries}
            bleedCarousel
          />
        )}
      </ContentLayout>
    </Layout>
  );
};

AnimationTechniquesPage.propTypes = {
  animationTechniquesData: PropTypes.object.isRequired,
  animationTechniquesWorksData: PropTypes.object.isRequired,
};

export default AnimationTechniquesPage;

export async function getServerSideProps({ locale, req, res, params, query }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useCraftAuthMiddleware(req, res, locale);

  const token = query && query.token;
  const animationTechniquesData = await fetchAPI(
    getAnimationTechniqueByIdQuery,
    {
      variables: { locale, id: params.id },
    },
    token,
  );
  const animationTechniquesWorksData = await fetchAPI(
    getWorksOfAnimationTechniqueQuery,
    {
      variables: { locale, id: params.id },
    },
    token,
  );

  return {
    props: { animationTechniquesData, animationTechniquesWorksData },
  };
}
