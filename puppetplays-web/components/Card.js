import PropTypes from 'prop-types';
import Link from 'next/link';
import { hasAtLeastOneItem } from 'lib/utils';
import styles from './card.module.scss';

function Card({ id, slug, title, subtitle, buttonLabel, mainImage }) {
  return (
    <Link href={`/techniques-d-animation/${id}/${slug}`}>
      <a className={styles.container}>
        {hasAtLeastOneItem(mainImage) && (
          <div className={styles.image}>
            <img src={mainImage[0].url} alt="" />
          </div>
        )}
        <div className={styles.openButton}>{buttonLabel}</div>
        <div className={styles.body}>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      </a>
    </Link>
  );
}

Card.defaultProps = {
  mainImage: null,
  subtitle: null,
};

Card.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  subtitle: PropTypes.node,
  mainImage: PropTypes.array,
};

export default Card;
