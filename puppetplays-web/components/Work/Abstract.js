import { Fragment } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Info from 'components/Info';
import styles from './abstract.module.scss';

function Abstract({ mainTheme, abstract }) {
  const { t } = useTranslation();

  return (
    <Info label={t('common:abstract')} fill show={abstract}>
      <Fragment>
        {mainTheme && <h3 className={styles.title}>{mainTheme}</h3>}
        <div dangerouslySetInnerHTML={{ __html: abstract }} />
      </Fragment>
    </Info>
  );
}

export default Abstract;
