import { getWorkById } from 'lib/api';
import WorkInList from 'components/WorkInList';

const Work = ({ initialData }) => {
  return <WorkInList {...initialData.entry} />;
};

export default Work;

export async function getServerSideProps({ locale, params }) {
  const apiUrl = `${process.env.API_URL}/api`;
  const data = await getWorkById(apiUrl, params.id, locale);
  return {
    props: { initialData: data },
  };
}
