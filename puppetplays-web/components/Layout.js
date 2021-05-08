import Header from 'components/Header';
import styles from './layout.module.scss';

function Layout({ aside, header, children }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {!header && <Header />}
        {header && <Header>{header}</Header>}
      </div>
      <div className={styles.content}>
        {aside && <aside className={styles.aside}>{aside}</aside>}
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}

export default Layout;
