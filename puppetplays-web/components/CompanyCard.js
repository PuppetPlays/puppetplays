import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Card from 'components/Card';
import styles from './authorCard.module.scss';

function CompanyCard({ id, slug, title }) {
  const { t } = useTranslation();

  return (
    <section className={styles.container}>
      <Card
        id={id}
        slug={slug}
        title={title}
        buttonLabel={t('common:readBiography')}
      />
    </section>
  );
}

CompanyCard.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default CompanyCard;
