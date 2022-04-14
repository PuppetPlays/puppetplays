import { useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import styles from './NewsletterForm.module.scss';

function NewsletterForm() {
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
    <form
      className={styles.subscribeForm}
      onSubmit={handleFormSubmit}
      action={`${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribe`}
      method="POST"
    >
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
        <div className={styles.formMessage}>{t('subscriptionSuccessful')}</div>
      )}
      {isSubmitError && (
        <div className={styles.formMessageError}>{t('subscriptionError')}</div>
      )}
    </form>
  );
}

export default NewsletterForm;
