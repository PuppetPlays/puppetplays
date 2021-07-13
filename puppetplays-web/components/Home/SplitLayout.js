import PropTypes from 'prop-types';
import { PageSubtitle, PageTitle } from 'components/Primitives';
import styles from './splitLayout.module.scss';
import { useCallback } from 'react';

const SplitLayout = ({ title, subtitle, children, image, linkRef }) => {
  const handleImageClick = useCallback(
    (evt) => {
      evt.preventDefault();
      if (linkRef.current) {
        linkRef.current.click();
      }
    },
    [linkRef],
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PageSubtitle>{subtitle}</PageSubtitle>
        <PageTitle>{title}</PageTitle>
        {children}
      </div>
      <div
        className={styles.media}
        onClick={handleImageClick}
        role="presentation"
      >
        {image && (
          <img
            src={image.url}
            alt=""
            style={{
              width: image.width < image.height ? '100%' : 'auto',
              height: image.height < image.width ? '100%' : 'auto',
            }}
          />
        )}
      </div>
    </div>
  );
};

SplitLayout.defaultProps = {
  title: null,
  footer: null,
  isComingSoon: false,
  linkRef: {},
};

SplitLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  image: PropTypes.object.isRequired,
  linkRef: PropTypes.object,
};

export default SplitLayout;
