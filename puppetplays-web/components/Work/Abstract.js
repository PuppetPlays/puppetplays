import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import Info from 'components/Info';
import styles from './abstract.module.scss';

function Abstract({ mainTheme, abstract }) {
  const { t } = useTranslation();

  return (
    <Info label={t('common:abstract')} fill show={!!abstract}>
      <Fragment>
        {mainTheme && <h3 className={styles.title}>{mainTheme}</h3>}
        <div dangerouslySetInnerHTML={{ __html: abstract }} />
      </Fragment>
    </Info>
  );
}

Abstract.defaultProps = {
  mainTheme: null,
  abstract: null,
};

Abstract.propTypes = {
  mainTheme: PropTypes.string,
  abstract: PropTypes.string,
};

export default Abstract;
