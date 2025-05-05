import { useTranslation } from 'next-i18next';
import { useState, useEffect, useRef } from 'react';

import styles from './PartnersBanner.module.scss';

const PartnerCard = ({ partner }) => {
  return (
    <a
      href={partner.link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.partnerCard}
      aria-label={`Visit ${partner.name} website`}
    >
      <div className={styles.partnerLogoContainer}>
        <img
          src={partner.logo}
          alt={partner.alt || partner.name}
          className={styles.partnerLogo}
        />
      </div>
      <span className={styles.partnerName}>{partner.name}</span>
    </a>
  );
};

const PartnersBanner = ({ partners = [] }) => {
  const { t } = useTranslation('team');
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);

  if (!partners || partners.length === 0) {
    return <p>{t('common:noData')}</p>;
  }

  // Pour le défilement infini, nous dupliquons les partenaires
  const extendedPartners = [...partners, ...partners, ...partners];

  useEffect(() => {
    // Reset position quand le carousel a défilé un ensemble complet
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollWidth = carouselRef.current.scrollWidth;
        const containerWidth = carouselRef.current.clientWidth;
        const scrollLeft = carouselRef.current.scrollLeft;

        // Si nous avons défilé un ensemble complet (atteint le deuxième groupe)
        if (scrollLeft >= scrollWidth / 3) {
          // Revenons discrètement au début
          carouselRef.current.scrollLeft = 0;
        }

        // Si nous sommes au tout début, accélérons au premier élément du groupe du milieu
        if (scrollLeft === 0) {
          carouselRef.current.scrollLeft = 1;
        }
      }
    };

    // Animation de défilement automatique
    let scrollInterval;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (carouselRef.current && !isPaused) {
          carouselRef.current.scrollLeft += 1;
        }
      }, 20); // Vitesse de défilement
    };

    startScrolling();
    carouselRef.current.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(scrollInterval);
      if (carouselRef.current) {
        carouselRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isPaused]);

  return (
    <div className={styles.partnersContainer}>
      <p className={styles.paragraph}>{t('partners.description')}</p>

      <div
        className={styles.partnersCarousel}
        ref={carouselRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={styles.partnersTrack}>
          {extendedPartners.map((partner, index) => (
            <div
              className={styles.partnerCardWrapper}
              key={`${partner.name}-${index}`}
            >
              <PartnerCard partner={partner} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.partnersNote}>
        <p>
          !This project has received funding from the European Research Council
          (ERC) under the European Union's Horizon 2020 research and innovation
          programme (grant agreement No 835193).
        </p>
      </div>
    </div>
  );
};

export default PartnersBanner;
