import styles from './keywords.module.scss';

export function Keyword({ children }) {
  return <li className={styles.keyword}>{children}</li>;
}

function Keywords({ keywords, fill }) {
  return (
    <ul className={styles.container} data-fill={fill}>
      {keywords.map((keyword) => (
        <Keyword key={keyword.title}>{keyword.title}</Keyword>
      ))}
    </ul>
  );
}

export default Keywords;
