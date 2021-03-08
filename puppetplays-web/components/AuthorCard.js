import useTranslation from 'next-translate/useTranslation';
import Author from 'components/Author';
import styles from './authorCard.module.scss';

function AuthorCard({ firstName, lastName, nickname, birthDate, deathDate }) {
  const { t } = useTranslation();

  return (
    <section className={styles.container}>
      <div className={styles.title}>
        <Author firstName={firstName} lastName={lastName} nickname={nickname} />
      </div>
      {(birthDate || deathDate) && (
        <div>
          {birthDate} - {deathDate}
        </div>
      )}
      <div className={styles.type}>{t('common:author')}</div>
    </section>
  );
}

export default AuthorCard;
