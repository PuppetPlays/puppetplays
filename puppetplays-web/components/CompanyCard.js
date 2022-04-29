import PropTypes from 'prop-types';
import Card from 'components/Card';
import styles from './authorCard.module.scss';

function CompanyCard({ id, slug, title }) {
  return (
    <section className={styles.container}>
      <Card href={`/auteurs/${id}/${slug}`} title={title} />
    </section>
  );
}

CompanyCard.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default CompanyCard;
