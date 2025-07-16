import NewsletterForm from 'components/NewsletterForm';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import styles from './Footer.module.scss';

const Footer = () => {
  const { t, i18n } = useTranslation(['common', 'home', 'project']);

  // Fonction utilitaire pour obtenir une traduction avec fallback
  const getTranslation = (key, fallback = '') => {
    try {
      return t(key, fallback);
    } catch (error) {
      console.warn(`Translation missing for key: ${key}`);
      return fallback;
    }
  };

  return (
    <footer className={styles.footer}>
      <section className={styles.intro}>
        <div className={styles.footerInner}>
          <div className={styles.introContent}>
            <NewsletterForm />

            <div className={styles.introContentLinks}>
              <Link
                href={getTranslation('home:ourSiteUrl', '/projet/presentation')}
                className={styles.buttonLink}
              >
                {getTranslation('common:knowMore', 'En savoir plus')}
              </Link>
              <Link href={getTranslation('home:theTeamUrl', '/projet/equipe')}>
                {getTranslation('home:theTeam', "L'équipe")}
              </Link>
              <Link
                href={getTranslation(
                  'home:projectNewsUrl',
                  '/projet/communications',
                )}
              >
                {getTranslation('home:projectNews', 'Actualités')}
              </Link>
              <Link
                href="https://tact.demarre-shs.fr/project/41"
                target="_blank"
                rel="noopener noreferrer"
              >
                {getTranslation('common:tactPlatform', 'Plateforme TACT')}
              </Link>
              <Link href="mailto:puppetplays@univ-montp3.fr">
                {getTranslation('common:contactUs', 'Nous contacter')}
              </Link>
              <Link href="/accessibilite">
                {getTranslation('common:accessibility', 'Accessibilité')}
              </Link>
              <Link href="/confidentialite">
                {getTranslation(
                  'common:privacy',
                  'Politique de confidentialité',
                )}
              </Link>
              <Link
                href="https://www.facebook.com/ERCPuppetPlays"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.facebookButton}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M32.0001 16.0032C32.0544 24.8285 24.7221 32.206 15.6084 31.9951C7.02749 31.797 -0.182823 24.6727 0.00353354 15.6332C0.180572 7.06862 7.26975 -0.189449 16.3809 0.00275566C24.9753 0.183953 32.034 7.23881 32.0001 16.0032ZM17.549 16.1014C18.2563 16.1014 18.9027 16.1014 19.5498 16.1014C20.136 16.1006 20.1538 16.1022 20.2199 15.5095C20.308 14.7119 20.3495 13.9084 20.4443 13.1108C20.4875 12.7459 20.363 12.6239 20.0149 12.629C19.3237 12.64 18.6307 12.6121 17.9404 12.6409C17.5939 12.6553 17.4897 12.5342 17.5067 12.209C17.5321 11.7306 17.5185 11.2506 17.5448 10.7722C17.577 10.1837 17.8701 9.86702 18.4673 9.8213C19.0009 9.78065 19.5388 9.78658 20.0742 9.79166C20.385 9.7942 20.5324 9.70784 20.5223 9.35645C20.4985 8.53852 20.5002 7.7189 20.5223 6.90097C20.5324 6.52079 20.3791 6.4031 20.0242 6.4141C19.0094 6.44628 17.9937 6.4539 16.9781 6.48607C15.1103 6.5445 13.7126 7.81373 13.5313 9.66973C13.45 10.4953 13.456 11.331 13.4653 12.1616C13.4695 12.5537 13.3873 12.7332 12.9553 12.6832C12.6072 12.6426 12.2506 12.6832 11.8973 12.6713C11.622 12.662 11.4831 12.7442 11.489 13.0541C11.5034 13.9431 11.5001 14.8322 11.4899 15.7212C11.4873 15.9778 11.5975 16.0845 11.838 16.0853C12.1913 16.087 12.5445 16.0955 12.8969 16.0853C13.4483 16.0692 13.4483 16.0641 13.4483 16.6306C13.4483 19.4671 13.4534 22.3045 13.4407 25.141C13.439 25.5457 13.5686 25.6913 13.9769 25.6829C14.979 25.6617 15.9811 25.6769 16.9832 25.6752C17.5295 25.6744 17.5566 25.6465 17.5566 25.0969C17.5558 22.8108 17.5524 20.5238 17.5507 18.2377C17.5482 17.5501 17.549 16.8601 17.549 16.1014Z"
                    fill="#F0F0F3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
