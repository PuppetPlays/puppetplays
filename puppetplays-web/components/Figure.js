import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import styles from './figure.module.scss';

function Figure({ url = null, alt = null, copyright = null, description = null }) {
  const { t } = useTranslation();

  return (
    <figure className={styles.container}>
      <img src={url} alt={alt} />
      {description && (
        <figcaption>
          {description}{' '}
          {copyright && (
            <span>
              – {t('common:imageCopyright')}
              {copyright}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

Figure.propTypes = {
  url: PropTypes.string.isRequired,
  alt: PropTypes.string,
  copyright: PropTypes.string,
  description: PropTypes.string,
};

export default Figure;
