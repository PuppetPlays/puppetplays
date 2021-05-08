import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import styles from './authorCard.module.scss';

function CompanyCard({ title }) {
  const { t } = useTranslation();

  return (
    <section className={styles.container}>
      <div>{title}</div>
      <div className={styles.type}>{t('common:company')}</div>
    </section>
  );
}

CompanyCard.propTypes = {
  title: PropTypes.string.isRequired,
};

export default CompanyCard;
