import CommaSepList from './CommaSepList';
import Place from './Place';
import WorkAuthor from './WorkAuthor';
import styles from './authorCard.module.scss';

function AuthorCard({
  firstName,
  lastName,
  nickname,
  birthDate,
  deathDate,
  places,
}) {
  return (
    <section className={styles.container}>
      <WorkAuthor
        firstName={firstName}
        lastName={lastName}
        nickname={nickname}
      />
      {(birthDate || deathDate) && (
        <div>
          {birthDate} - {deathDate}
        </div>
      )}
      {places && places.length > 0 && (
        <CommaSepList list={places} itemComponent={Place} separator=" - " />
      )}
    </section>
  );
}

export default AuthorCard;
