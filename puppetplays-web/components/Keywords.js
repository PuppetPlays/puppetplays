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
      <a href={`/base-de-donnees?theatricalTechniques=${id}`}>{children}</a>
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
      <a href={`/base-de-donnees?relatedToTags=${id}`}>{children}</a>
    </li>
  );
}

Tag.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function Keywords({ keywords, component: Component, fill }) {
  return (
    <ul className={styles.container} data-fill={fill}>
      {keywords.map(({ title, ...keyword }) => (
        <Component key={title} {...keyword}>
          {title}
        </Component>
      ))}
    </ul>
  );
}

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
