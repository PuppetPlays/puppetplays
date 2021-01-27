import Header from './Header';
import styles from './layout.module.scss';

function Layout({ children, translations }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header translations={translations} />
      </div>
      <main className={styles.content}>{children}</main>
    </div>
  );
}

export default Layout;
