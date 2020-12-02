import Header from './Header';
import styles from './layout.module.scss';

function Layout({ children }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header />
      </div>
      <main className={styles.content}>{children}</main>
    </div>
  );
}

export default Layout;
