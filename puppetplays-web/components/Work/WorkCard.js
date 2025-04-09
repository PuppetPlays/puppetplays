import PropTypes from 'prop-types';
import Link from 'next/link';
import WorkHeader from './WorkHeader';
import styles from './workCard.module.scss';

function WorkCard({
  id = null,
  slug = null,
  title = null,
  authors = [],
  mostRelevantDate = null,
  compositionPlace = [],
  mainLanguage = null,
}) {
  return (
    <article className={styles.container}>
      <WorkHeader
        title={
          <Link href={`/oeuvres/${id}/${slug}`}>
            {title}
          </Link>
        }
        authors={authors}
        mostRelevantDate={mostRelevantDate}
        compositionPlace={compositionPlace}
        mainLanguage={mainLanguage}
        isCompact
      />
    </article>
  );
}

WorkCard.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      typeHandle: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }),
  ),
  mostRelevantDate: PropTypes.string,
  compositionPlace: PropTypes.shape({
    name: PropTypes.string,
    country: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  mainLanguage: PropTypes.string,
};

export default WorkCard;
