import { Fragment, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import styles from 'styles/Wip.module.scss';
import LanguageSelector from 'components/LanguageSelector';

const PARTNERS = ['ue', 'erc', 'upvm', 'humanum', 'rir', 'intactile'];

export default function Wip() {
  const { locale } = useRouter();
  const { t } = useTranslation('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);

  const handleFormSubmissionError = (response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  };

  const hideMessage = (cb) => setTimeout(() => cb(false), 6000);

  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    const target = evt.target;
    setIsSubmitting(true);

    fetch(target.action, {
      method: target.method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: target.querySelector('[name="email"]').value,
        locale,
      }),
    })
      .then(handleFormSubmissionError)
      .then(() => {
        setIsSubmitting(false);
        setIsSubmitSuccessful(true);
        target.reset();
        hideMessage(setIsSubmitSuccessful);
      })
      .catch(() => {
        setIsSubmitting(false);
        setIsSubmitError(true);
        hideMessage(setIsSubmitError);
      });
  };

  return (
    <Fragment>
      <Head>
        <title>Puppetplays | {t('title')}</title>
      </Head>

      <div className={styles.container}>
        <header>
          <div className={styles.LanguageSelector}>
            <LanguageSelector inverse path="/wip" />
          </div>
        </header>

        <main>
          <div className={styles.header}>
            <div className={styles.headerInner}>
              <div className={styles.headerMain}>
                <div>
                  <img
                    src="/logo-stamp-white.png"
                    width="205"
                    alt="Puppetplays - A Research Program Founded by the European Union"
                  />
                </div>
                <div className={styles.releaseDate}>{t('releaseDate')}</div>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>
              </div>
              <section className={styles.sidebar}>
                <div className={styles.sidebarTop}>
                  <h2>{t('projectNews')}</h2>
                  <a
                    className={styles.buttonLink}
                    href={t('ourSiteUrl')}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {t('ourSiteLabel')}
                  </a>
                  <a
                    aria-label={t('facebookLinkLabel')}
                    className={styles['buttonLink--iconOnly']}
                    href="https://www.facebook.com/ERCPuppetPlays"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <svg
                      aria-hidden
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.0372 10.0496H14.1082L14.1132 10.0496C14.6922 10.0488 14.71 10.0488 14.7757 9.49674C14.8634 8.75169 14.9048 8.18401 14.9993 7.43896C15.0423 7.09807 14.9183 6.98418 14.5715 6.98893C13.8828 6.99921 13.1149 6.97311 12.4271 7C12.082 7.01345 11.9782 6.90034 11.995 6.59663C12.0204 6.14976 12.0068 5.5184 12.033 5.07153C12.0651 4.52184 12.3571 4.22603 12.952 4.18332C13.4744 4.14602 14.0009 4.15072 14.5251 4.15539L14.5529 4.15564C14.8626 4.15801 15.0094 4.07734 14.9993 3.74911C14.9757 2.98507 14.9774 2.21946 14.9993 1.45543C15.0094 1.10031 14.8567 0.990368 14.5031 1.00065C13.4921 1.03071 12.4803 1.03782 11.4684 1.06788C9.60765 1.12245 8.21522 2.30805 8.03462 4.04175C7.95361 4.8129 7.95971 5.64653 7.969 6.42242C7.97322 6.78862 7.89136 6.9563 7.46097 6.90963C7.11413 6.87167 6.75884 6.90963 6.40694 6.89856C6.13267 6.88986 5.99427 6.96658 6.00018 7.25606C6.01453 8.08653 6.01095 8.864 6.00083 9.69447C5.99829 9.93412 6.108 10.0338 6.34767 10.0346C6.69957 10.0361 7.05148 10.0441 7.40254 10.0346C7.95192 10.0195 7.95192 10.0148 7.95192 10.5439C7.95192 13.1935 7.95698 15.8439 7.94432 18.4935C7.94264 18.8715 8.07175 19.0076 8.47851 18.9997C9.47684 18.9799 10.4752 18.9941 11.4735 18.9926C12.0178 18.9918 12.0448 18.9657 12.0448 18.4524C12.044 16.3169 12.0406 14.1806 12.0389 12.0451C12.0364 11.4029 12.0372 10.7583 12.0372 10.0496Z" />
                    </svg>
                  </a>
                </div>
                <div className={styles.sidebarMain}>
                  <form
                    className={styles.subscribeForm}
                    onSubmit={handleFormSubmit}
                    action={`${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribe`}
                    method="POST"
                  >
                    <h2 className={styles.subscribeTitle}>
                      {t('subscribeTitle')}
                    </h2>
                    <label className={styles.subscribeLabel} htmlFor="email">
                      {t('subscribeLabel')}
                    </label>
                    <div className={styles.subscribeFormGroup}>
                      <input
                        name="email"
                        id="email"
                        required
                        placeholder={t('emailPlaceholder')}
                      />
                      <button type="submit" disabled={isSubmitting}>
                        {t('subscribe')}
                      </button>
                    </div>
                    {isSubmitSuccessful && (
                      <div className={styles.formMessage}>
                        {t('subscriptionSuccessful')}
                      </div>
                    )}
                    {isSubmitError && (
                      <div className={styles.formMessageError}>
                        {t('subscriptionError')}
                      </div>
                    )}
                  </form>
                  <div className={styles.partnersBar}>
                    <ul className={styles.partnersBarLogos}>
                      {PARTNERS.map((partner) => (
                        <li key={partner}>
                          <a
                            href={t(`${partner}.url`)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              height="60"
                              src={`/logo-${partner}.png`}
                              alt={t(`${partner}.alt`)}
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.contentInner}>
              <section className={styles.intro}>
                <div className={styles.introContent}>
                  <h2 className={styles.introSubtitle}>{t('introSubtitle')}</h2>
                  <h3 className={styles.introTitle}>{t('introTitle')}</h3>
                  <p>{t('introText1')}</p>
                  <p>{t('introText2')}</p>
                  <p>{t('introText3')}</p>
                  <div className={styles.introContentLinks}>
                    <a
                      href={t('ourSiteUrl')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.buttonLink}
                    >
                      {t('common:knowMore')}
                    </a>
                    <a
                      href={t('theTeamUrl')}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('theTeam')}
                    </a>
                    <a href="mailto:contact@puppetplays.eu">
                      <span className={styles.linkIcon} aria-hidden>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.5676 3.08302C17.3811 3.02904 17.1831 3 16.978 3H3.02205C2.69596 3 2.3879 3.07338 2.11514 3.20371L9.7779 10.4881L17.5676 3.08302Z" />
                          <path d="M18.8081 4.10373L10.935 11.588C10.2959 12.1955 9.25986 12.1955 8.62082 11.588L1.072 4.41198C1.02507 4.57446 1 4.74554 1 4.9222V15.0778C1 16.1394 1.9053 17 3.02205 17H16.978C18.0947 17 19 16.1394 19 15.0778V4.9222C19 4.62948 18.9312 4.35205 18.8081 4.10373Z" />
                        </svg>
                      </span>
                      <span>{t('common:contactUs')}</span>
                    </a>
                  </div>
                </div>
                <div className={styles.introMedia}>
                  <img src="/home-intro-illustration.png" alt="" />
                  <p className={styles.introMediaCaption}>
                    {t('introImageCaption')}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerContent}>
              <img src="/logo-ue.png" height="60" alt={t('ue.alt')} />
              <img src="/logo-erc.png" height="60" alt={t('erc.alt')} />
              <p>{t('projectFinancedBy')}</p>
            </div>
          </div>
        </footer>
      </div>
    </Fragment>
  );
}
