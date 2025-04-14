import Link from 'next/link';
import PropTypes from 'prop-types';

import styles from './keywords.module.scss';

export function Keyword({ children }) {
  return <li className={styles.keyword}>{children}</li>;
}

Keyword.propTypes = {
  children: PropTypes.node.isRequired,
};

export function TheatricalTechniqueTag({ id, children }) {
  return (
    <li className={styles.tag}>
      <Link href={`/base-de-donnees?theatricalTechniques=${id}`}>
        {children}
      </Link>
    </li>
  );
}

TheatricalTechniqueTag.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export function Tag({ id, children }) {
  return (
    <li className={styles.tag}>
      <Link href={`/base-de-donnees?relatedToTags=${id}`}>{children}</Link>
    </li>
  );
}

Tag.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Keywords = ({ keywords, component: Component, fill }) => {
  const keywordsArray = keywords || [];
  return (
    <ul className={styles.container} data-fill={fill}>
      {keywordsArray.map(({ title, ...keyword }) => (
        <Component key={title} {...keyword}>
          {title}
        </Component>
      ))}
    </ul>
  );
};

Keywords.defaultProps = {
  fill: false,
  component: Keyword,
};

Keywords.propTypes = {
  keywords: PropTypes.arrayOf(PropTypes.object).isRequired,
  component: PropTypes.func,
  fill: PropTypes.bool,
};

export default Keywords;
