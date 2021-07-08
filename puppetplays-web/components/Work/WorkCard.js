import PropTypes from 'prop-types';
import Link from 'next/link';
import WorkHeader from './WorkHeader';
import styles from './workCard.module.scss';

function WorkCard({
  id,
  slug,
  title,
  authors,
  mostRelevantDate,
  compositionPlace,
  mainLanguage,
}) {
  return (
    <article className={styles.container}>
      <WorkHeader
        title={
          <Link href={`/oeuvres/${id}/${slug}`}>
            <a>{title}</a>
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

WorkCard.defaultProps = {
  authors: [],
  mostRelevantDate: null,
  compositionPlace: [],
  mainLanguage: [],
};

WorkCard.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  authors: PropTypes.array,
  mostRelevantDate: PropTypes.string,
  compositionPlace: PropTypes.array,
  mainLanguage: PropTypes.array,
};

export default WorkCard;
