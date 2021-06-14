import PropTypes from 'prop-types';
import { PageSubtitle, PageTitle } from 'components/Primitives';
import styles from './splitLayout.module.scss';

const SplitLayout = ({ title, subtitle, children, image }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PageSubtitle>{subtitle}</PageSubtitle>
        <PageTitle>{title}</PageTitle>
        {children}
      </div>
      <div className={styles.media}>
        {image && <img src={image.url} alt="" />}
      </div>
    </div>
  );
};

SplitLayout.defaultProps = {
  title: null,
  footer: null,
  isComingSoon: false,
};

SplitLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  image: PropTypes.object.isRequired,
};

export default SplitLayout;
