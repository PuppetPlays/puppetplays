import PropTypes from 'prop-types';
import BirthDeathDates from 'components/BirthDeathDates';
import Author from 'components/Author';
import Card from 'components/Card';
import styles from './authorCard.module.scss';

function AuthorCard({
  id,
  slug,
  usualName = null,
  firstName = null,
  lastName = null,
  nickname = null,
  birthDate = null,
  deathDate = null,
  mainImage = null,
}) {
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
          <div>
            <BirthDeathDates birthDate={birthDate} deathDate={deathDate} />
          </div>
        }
        mainImage={mainImage}
      />
    </section>
  );
}

AuthorCard.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  usualName: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  nickname: PropTypes.string,
  birthDate: PropTypes.string,
  deathDate: PropTypes.string,
  mainImage: PropTypes.arrayOf(PropTypes.object),
};

export default AuthorCard;
