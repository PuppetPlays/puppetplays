import styles from './keywords.module.scss';

export function Keyword({ children }) {
  return <li className={styles.keyword}>{children}</li>;
}

function Keywords({ keywords }) {
  return (
    <ul className={styles.container}>
      {keywords.map((keyword) => (
        <Keyword key={keyword.title}>{keyword.title}</Keyword>
      ))}
    </ul>
  );
}

export default Keywords;
