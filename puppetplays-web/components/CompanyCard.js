import CommaSepList from './CommaSepList';
import Place from './Place';
import styles from './authorCard.module.scss';

function CompanyCard({ title, places }) {
  return (
    <section className={styles.container}>
      <div>{title}</div>
      {places && places.length > 0 && (
        <CommaSepList list={places} itemComponent={Place} separator=" - " />
      )}
    </section>
  );
}

export default CompanyCard;
