import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Author from 'components/Author';
import Card from 'components/Card';
import styles from './authorCard.module.scss';

function AuthorCard({
  id,
  slug,
  usualName,
  firstName,
  lastName,
  nickname,
  birthDate,
  deathDate,
}) {
  const { t } = useTranslation();

  return (
    <section className={styles.container}>
      <Card
        href={`/auteurs/${id}/${slug}`}
        title={
          <Author
            id={id}
            usualName={usualName}
            firstName={firstName}
            lastName={lastName}
            nickname={nickname}
          />
        }
        subtitle={
          (birthDate || deathDate) && (
            <div>
              {birthDate} - {deathDate}
            </div>
          )
        }
        buttonLabel={t('common:readBiography')}
      />
    </section>
  );
}

AuthorCard.defaultProps = {
  usualName: null,
  firstName: null,
  lastName: null,
  nickname: null,
  birthDate: null,
  deathDate: null,
};

AuthorCard.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  usualName: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  nickname: PropTypes.string,
  birthDate: PropTypes.string,
  deathDate: PropTypes.string,
};

export default AuthorCard;
