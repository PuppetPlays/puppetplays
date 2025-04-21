import ProjectLayout from 'components/Project/ProjectLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from 'styles/ProjectPresentation.module.scss';

const PARTNERS = [
  {
    name: 'rir',
    link: 'https://rirra21.www.univ-montp3.fr/',
    logo: '/logo-rir.svg',
    alt: 'RIR',
  },
  {
    name: 'upvm',
    link: 'https://www.univ-montp3.fr/',
    logo: '/logo-upvm.svg',
    alt: 'UPVM',
  },
];

const PartnersBar = ({ t }) => {
  return (
    <div className={styles.partnersBar}>
      <ul className={styles.logosBar}>
        <li>
          <Link
            href="https://european-union.europa.eu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('home:ue.alt')}
          >
            <img
              src="/logo-ue.png"
              height="86"
              alt={t('home:ue.alt') || 'European Union Logo'}
            />
          </Link>
        </li>
        <li>
          <Link
            href="https://erc.europa.eu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('home:erc.alt')}
          >
            <img
              src="/logo-erc.png"
              height="86"
              alt={t('home:erc.alt') || 'European Research Council Logo'}
            />
          </Link>
        </li>
        <p>
          {t('home:projectFinancedBy') ||
            'This project is financed by the European Union'}
        </p>
      </ul>
      <div className={styles.logosBarSpacer} />
      <ul className={styles.logosBar}>
        {PARTNERS &&
          Array.isArray(PARTNERS) &&
          PARTNERS.map(partner => (
            <li key={partner.name}>
              <Link
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={partner.alt || `${partner.name} logo`}
              >
                <img
                  height="52"
                  src={partner.logo}
                  alt={partner.alt || `${partner.name} logo`}
                />
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

const ProjectPresentation = () => {
  const { t } = useTranslation(['project', 'common', 'home']);

  return (
    <ProjectLayout
      title={t('presentation.title')}
      metaDescription={t('metaDescription')}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('title')}</h1>
        </header>

        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <p className={styles.paragraph}>
              {t('presentation.description.intro')}
            </p>

            <p className={styles.listTitle}>
              {t('presentation.description.goals.title')}
            </p>
            <ul className={styles.list}>
              <li>{t('presentation.description.goals.goal1')}</li>
              <li>{t('presentation.description.goals.goal2')}</li>
              <li>{t('presentation.description.goals.goal3')}</li>
            </ul>
          </div>
          <div className={styles.heroMedia}>
            <Image
              src="/home-intro-illustration.png"
              alt={
                t('presentation.heroImage.alt') || 'PuppetPlays Illustration'
              }
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 80vw, (max-width: 860px) 70vw, 45vw"
              priority
            />
          </div>
        </div>

        <section className={styles.section}>
          <p className={styles.listTitle}>
            {t('presentation.description.ambitions.title')}
          </p>
          <ul className={styles.list}>
            <li>{t('presentation.description.ambitions.ambition1')}</li>
            <li>{t('presentation.description.ambitions.ambition2')}</li>
            <li>{t('presentation.description.ambitions.ambition3')}</li>
          </ul>
          <p className={styles.paragraph}>
            {t('presentation.description.access')}
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t('presentation.invisibleRepertoire.title')}
          </h2>
          <p className={styles.paragraph}>
            {t('presentation.invisibleRepertoire.paragraph1')}
          </p>
          <p className={styles.paragraph}>
            {t('presentation.invisibleRepertoire.paragraph2')}
          </p>
          <p className={styles.paragraph}>
            {t('presentation.invisibleRepertoire.paragraph3')}
          </p>
          <div className={styles.blockquote}>
            {t('presentation.invisibleRepertoire.paragraph4')}
          </div>
          <p className={styles.paragraph}>
            {t('presentation.invisibleRepertoire.paragraph5')}
          </p>
          <p className={styles.paragraph}>
            {t('presentation.invisibleRepertoire.paragraph6')}
          </p>
          <p className={styles.paragraph}>
            {t('presentation.invisibleRepertoire.paragraph7')}
          </p>
          <p className={styles.paragraph}>
            {t('presentation.invisibleRepertoire.paragraph8')}
          </p>
          <p className={styles.paragraph}>
            {t('presentation.invisibleRepertoire.paragraph9')}
          </p>
          <p className={styles.paragraph}>
            {t('presentation.invisibleRepertoire.paragraph10')}
          </p>
          <p className={styles.paragraph}>
            {t('presentation.invisibleRepertoire.paragraph11')}
          </p>
        </section>

        <div className={styles.partnersSection}>
          <PartnersBar t={t} />
        </div>

        <div className={styles.videoSection}>
          <div className={styles.videoContainer}>
            <h2 className={styles.sectionTitle}>
              {t('presentation.video.title')}
            </h2>
            <div className={styles.videoWrapper}>
              <video
                controls
                preload="metadata"
                className={styles.video}
                playsInline
                controlsList="nodownload"
                aria-label={
                  t('presentation.video.ariaLabel') ||
                  'Vidéo de présentation PuppetPlays'
                }
              >
                <source
                  src="/videos/PuppetPlays Presentation.mp4"
                  type="video/mp4"
                />
                <track
                  kind="captions"
                  src="/videos/captions.vtt"
                  srcLang="fr"
                  label="Français"
                  default
                />
                <p>{t('presentation.video.placeholder')}</p>
              </video>
            </div>
            <p className={styles.videoCaption}>
              {t('presentation.video.caption')}
            </p>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t('presentation.centralHypothesis.title')}
          </h2>
          <p className={styles.paragraph}>
            {t('presentation.centralHypothesis.paragraph1')}
          </p>
          <p className={styles.paragraph}>
            {t('presentation.centralHypothesis.paragraph2')}
          </p>
          <p className={styles.paragraph}>
            {t('presentation.centralHypothesis.paragraph3')}
          </p>
          <p className={styles.paragraph}>
            {t('presentation.centralHypothesis.paragraph4')}
          </p>
          <p className={styles.paragraph}>
            {t('presentation.centralHypothesis.paragraph5')}
          </p>
        </section>
      </div>
    </ProjectLayout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'project', 'home'])),
    },
  };
}

export default ProjectPresentation;
