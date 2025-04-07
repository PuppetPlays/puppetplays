import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './keywords.module.scss';

export function Keyword({ children }) {
  if (!children) return null;
  return <li className={styles.keyword}>{children}</li>;
}

Keyword.propTypes = {
  children: PropTypes.node,
};

export function TheatricalTechniqueTag({ id, children }) {
  if (!id || !children) return null;

  return (
    <li className={styles.tag}>
      <Link href={`/base-de-donnees?theatricalTechniques=${id}`} legacyBehavior>
        <a tabIndex="0">{children}</a>
      </Link>
    </li>
  );
}

TheatricalTechniqueTag.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
};

export function Tag({ id, children }) {
  if (!id || !children) return null;

  return (
    <li className={styles.tag}>
      <Link href={`/base-de-donnees?relatedToTags=${id}`} legacyBehavior>
        <a tabIndex="0">{children}</a>
      </Link>
    </li>
  );
}

Tag.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
};

function Keywords({ keywords, component: Component, fill }) {
  // Handle null, undefined, or empty keywords array
  const safeKeywords = Array.isArray(keywords) ? keywords : [];

  if (safeKeywords.length === 0) return null;

  return (
    <ul className={styles.container} data-fill={fill}>
      {safeKeywords &&
        Array.isArray(safeKeywords) &&
        safeKeywords.map(({ title, id, ...keyword }) => {
          if (!title) return null;
          return (
            <Component key={id || title} id={id} {...keyword}>
              {title}
            </Component>
          );
        })}
    </ul>
  );
}

Keywords.defaultProps = {
  fill: false,
  component: Keyword,
  keywords: [],
};

Keywords.propTypes = {
  keywords: PropTypes.arrayOf(PropTypes.object),
  component: PropTypes.func,
  fill: PropTypes.bool,
};

export default Keywords;
