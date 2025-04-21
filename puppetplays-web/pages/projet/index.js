import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';

const ProjectIndex = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/projet/presentation');
  }, [router]);

  return null;
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'project'])),
    },
  };
}

export default ProjectIndex;
