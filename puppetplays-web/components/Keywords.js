import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './keywords.module.scss';

export function Keyword({ id, children }) {
  return (
    <li className={styles.keyword}>
      {id ? (
        <Link href={`/repertoire?relatedToTags=${id}`}>
          <a>{children}</a>
        </Link>
      ) : (
        children
      )}
    </li>
  );
}

Keyword.defaultProps = {
  id: null,
};

Keyword.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node.isRequired,
};

function Keywords({ keywords, fill }) {
  return (
    <ul className={styles.container} data-fill={fill}>
      {keywords.map((keyword) => (
        <Keyword key={keyword.title} id={keyword.id}>
          {keyword.title}
        </Keyword>
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
