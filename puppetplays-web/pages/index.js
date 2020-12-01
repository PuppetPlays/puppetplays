import Head from 'next/head'
import { getAllWorks } from 'lib/api';
import styles from 'styles/Home.module.css'

export default function Home({ allWorks }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Puppetplays</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Puppetplays
        </h1>
        {allWorks.map((work) => (
          <div>
            <h2>{work.title}</h2>
            <p>{work.abstract}</p>
          </div>
        ))}
      </main>
    </div>
  )
}

export async function getServerSideProps({ locale }) {
  const apiUrl = `${process.env.API_URL}/api`;
  const allWorks = (await getAllWorks(apiUrl, locale)) || [];
  return {
    props: { allWorks },
  };
}
