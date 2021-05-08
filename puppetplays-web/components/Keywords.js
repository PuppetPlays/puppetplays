import PropTypes from 'prop-types';
import styles from './keywords.module.scss';

export function Keyword({ children }) {
  return <li className={styles.keyword}>{children}</li>;
}

Keyword.propTypes = {
  children: PropTypes.node.isRequired,
};

function Keywords({ keywords, fill }) {
  return (
    <ul className={styles.container} data-fill={fill}>
      {keywords.map((keyword) => (
        <Keyword key={keyword.title}>{keyword.title}</Keyword>
      ))}
    </ul>
  );
}

Keywords.defaultProps = {
  fill: false,
};

Keywords.propTypes = {
  keywords: PropTypes.arrayOf(PropTypes.object).isRequired,
  fill: PropTypes.bool,
};

export default Keywords;
