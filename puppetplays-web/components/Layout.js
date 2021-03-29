import Header from './Header';
import { useRouter } from 'next/router';
import styles from './layout.module.scss';

function Layout({ children }) {
  const { pathname } = useRouter();

  return (
    <div className={styles.container}>
      {pathname !== '/wip' && (
        <div className={styles.header}>
          <Header />
        </div>
      )}
      <main className={styles.content}>{children}</main>
    </div>
  );
}

export default Layout;
