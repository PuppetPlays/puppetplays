import PropTypes from 'prop-types';
import { PageSubtitle, PageTitle } from 'components/Primitives';
import styles from './splitLayout.module.scss';
import { useCallback } from 'react';

const SplitLayout = ({ 
  title, 
  subtitle, 
  children, 
  image, 
  linkRef, 
  date 
}) => {
  const handleImageClick = useCallback(
    (evt) => {
      evt.preventDefault();
      if (linkRef && linkRef.current) {
        linkRef.current.click();
      }
    },
    [linkRef],
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
        {title && <PageTitle>{title}</PageTitle>}
        {date && <div className={styles.date}>{date}</div>}
        {children}
      </div>
      {image && image.url && (
        <div
          className={styles.media}
          onClick={linkRef ? handleImageClick : undefined}
          role={linkRef ? "button" : "presentation"}
          tabIndex={linkRef ? 0 : undefined}
          aria-label={linkRef ? `View details for ${title || ''}` : undefined}
          onKeyDown={linkRef ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleImageClick(e);
            }
          } : undefined}
          style={{
            backgroundImage: `url(${image.url})`,
          }}
        />
      )}
    </div>
  );
};

SplitLayout.defaultProps = {
  title: '',
  subtitle: '',
  date: '',
  image: null,
  linkRef: null,
};

SplitLayout.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  date: PropTypes.string,
  children: PropTypes.node.isRequired,
  image: PropTypes.shape({
    url: PropTypes.string
  }),
  linkRef: PropTypes.shape({
    current: PropTypes.any
  }),
};

export default SplitLayout;
