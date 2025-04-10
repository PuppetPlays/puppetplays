import { useCallback, useState } from 'react';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { hasAtLeastOneItem } from 'lib/utils';
import { fetchAPI, getWorkDocumentByIdQuery } from 'lib/api';
import CloseButton from 'components/CloseButton';
import styles from './workDocument.module.scss';

const IconDownload = () => {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10V13H13V10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 3V9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.5 7.5L8 9.5L10.5 7.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

const usePagination = initialPage => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handleScroll = useCallback(evt => {
    const containerScrollTop = evt.target.scrollTop;
    const currentNode = Array.from(
      evt.target.querySelectorAll('[data-page]'),
    ).find(node => {
      return node.offsetTop + node.clientHeight >= containerScrollTop;
    });
    setCurrentPage(parseInt(currentNode.dataset.page, 10));
  }, []);

  return [currentPage, handleScroll];
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

const WorkDocument = ({ workId = null, onClose = null }) => {
  const { t } = useTranslation();
  const [isSideBarOpen, setIsSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [currentPage, onScroll] = usePagination(0);
  const router = useRouter();
  const { data } = useSWR(
    [getWorkDocumentByIdQuery, router.locale, workId],
    (query, locale, id) => {
      return fetchAPI(query, {
        variables: {
          locale,
          id,
        },
      });
    },
  );

  const handleScrollToPage = page => {
    location.hash = '#page-' + page;
  };

  const handleZoomIn = () => {
    setZoom(zoom + 1);
  };

  const handleZoomOut = () => {
    setZoom(zoom - 1);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <CloseButton onClick={onClose} />
      </header>
      <div className={styles.layout}>
        {data && (
          <div className={styles.sidebar} data-open={isSideBarOpen}>
            <div className={styles.sidebarHeader}>
              <h2>{t('common:flatplan')}</h2>
              <button
                className={styles.iconButton}
                type="button"
                onClick={() => setIsSidebarOpen(!isSideBarOpen)}
              >
                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 3.5L5 8L10 12.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <ul className={styles.sidebarContent}>
              {data.entry?.images &&
                Array.isArray(data.entry.images) &&
                data.entry.images.map((image, index) => (
                  <li
                    key={image.id}
                    className={styles.sidebarPage}
                    data-selected={index === currentPage}
                  >
                    <Link href={`#page-${index}`}>
                      <div>{index + 1}</div>
                      <img src={image.url} alt="" />
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
        <div className={styles.content} onScroll={onScroll}>
          <div className={styles.scroll} data-zoom={zoom}>
            {data &&
              data.entry?.images &&
              Array.isArray(data.entry.images) &&
              data.entry.images.map((image, index) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt=""
                  id={`page-${index}`}
                  data-page={index}
                />
              ))}
          </div>
        </div>
      </div>
      {data && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.iconButton}
            disabled={currentPage === 0}
            onClick={() => handleScrollToPage(currentPage - 1)}
          >
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 10.5L8 5.5L3.5 10.5" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.iconButton}
            disabled={currentPage === data.entry.images.length - 1}
            onClick={() => handleScrollToPage(currentPage + 1)}
          >
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 5.5L8 10.5L12.5 5.5" />
            </svg>
          </button>
          <div className={styles.paginationSelector}>
            Page {currentPage + 1} / {data.entry.images.length}
          </div>
          <button
            type="button"
            className={styles.iconButtonFill}
            disabled={zoom === MAX_ZOOM}
            onClick={handleZoomIn}
          >
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="7" width="8" height="2" />
              <rect x="7" y="4" width="2" height="8" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.iconButtonFill}
            disabled={zoom === MIN_ZOOM}
            onClick={handleZoomOut}
          >
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="7" width="8" height="2" />
            </svg>
          </button>
        </div>
      )}
      <div className={styles.action}>
        {data && hasAtLeastOneItem(data.entry.pdf) && (
          <Link href={data.entry.pdf[0].url} target="_blank" rel="noreferrer">
            <IconDownload />
          </Link>
        )}
      </div>
    </div>
  );
};

WorkDocument.propTypes = {
  onClose: PropTypes.func.isRequired,
  workId: PropTypes.string.isRequired,
};

export default WorkDocument;
