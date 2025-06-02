import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import styles from './PressReviews.module.scss';

const PressReviewCard = ({ review }) => {
  const { t } = useTranslation(['project', 'common']);

  const {
    title,
    authorsPress,
    publicationName,
    publicationDate,
    consultationDate,
    articleLink,
    thumbnail,
  } = review;

  // Fonction pour formater la date avec le mois traduit
  const formatDate = dateString => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const day = date.getDate();
    const month = date.getMonth(); // 0-11
    const year = date.getFullYear();

    // Utiliser la traduction pour le nom du mois
    const translatedMonth = t(`common:months.${month}`);

    return `${day} ${translatedMonth} ${year}`;
  };

  const imageUrl =
    thumbnail && thumbnail.length > 0
      ? thumbnail[0].url
      : '/press-review-placeholder.jpg';

  const isOnlineArticle = articleLink && articleLink !== '';

  return (
    <div className={styles.articleCard}>
      <Link
        href={articleLink || '#'}
        className={styles.thumbnailContainer}
        target={isOnlineArticle ? '_blank' : '_self'}
        rel={isOnlineArticle ? 'noopener noreferrer' : ''}
      >
        <img
          src={imageUrl}
          alt={`${title} - ${t('common:image')}`}
          className={styles.thumbnail}
        />
      </Link>

      <div className={styles.contentContainer}>
        <div className={styles.articleCardHeader}>
          <div className={styles.date}>
            {publicationDate ? formatDate(publicationDate) : ''}
          </div>
        </div>

        <h3 className={styles.cardTitle}>
          <Link
            href={articleLink || '#'}
            target={isOnlineArticle ? '_blank' : '_self'}
            rel={isOnlineArticle ? 'noopener noreferrer' : ''}
          >
            {title}
          </Link>
        </h3>

        <p className={styles.excerpt}>
          {publicationName && <em>{publicationName}</em>}
          {consultationDate && isOnlineArticle && (
            <span>
              {' '}
              - {t('project:pressReviews.consultationDate')}{' '}
              {formatDate(consultationDate)}
            </span>
          )}
        </p>

        <div className={styles.metaContainer}>
          {authorsPress && (
            <span className={styles.author}>
              {t('project:communications.par')} {authorsPress}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const PressReviews = ({ reviews }) => {
  const { t } = useTranslation(['project', 'common']);

  if (!reviews || reviews.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>{t('project:pressReviews.noReviewsFound')}</p>
      </div>
    );
  }

  return (
    <div className={styles.articleGrid}>
      {reviews.map(review => (
        <PressReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default PressReviews;
