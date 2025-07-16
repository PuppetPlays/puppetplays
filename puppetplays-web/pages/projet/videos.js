import FilterSelect from 'components/FilterSelect';
import NoResults from 'components/NoResults';
import Pagination from 'components/Pagination';
import ProjectLayout from 'components/Project/ProjectLayout';
import {
  fetchCollection,
  fetchCollectionVideos,
  fetchCollectionVideoCount,
  NAKALA_COLLECTIONS,
  getMetaValue,
  getMetaValues,
} from 'lib/nakala';
import { stringifyQuery } from 'lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useCallback, useEffect } from 'react';
import styles from 'styles/VideoPage.module.scss';

const VideosPage = ({ initialCollectionsData, error }) => {
  const { t, i18n } = useTranslation(['common', 'project']);
  const router = useRouter();
  const [searchTerms, setSearchTerms] = useState(router.query.search || '');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionVideos, setCollectionVideos] = useState([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [selectedCollectionTotalVideos, setSelectedCollectionTotalVideos] =
    useState(0);
  const [currentPage, setCurrentPage] = useState(
    router.query.page ? parseInt(router.query.page, 10) - 1 : 0,
  );
  const [filters, setFilters] = useState({
    tags: router.query.tags ? router.query.tags.split(',') : [],
    sortBy: router.query.sortBy || 'date',
  });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const VIDEOS_PER_PAGE = 10;
  const COLLECTIONS_PER_PAGE = 10;

  const fetchAndSetVideos = useCallback(
    async (collectionId, currentPage = 0) => {
      setIsLoadingVideos(true);
      setCollectionVideos([]);
      setSelectedCollectionTotalVideos(0);
      try {
        const apiVideos = await fetchCollectionVideos(collectionId, {
          page: currentPage + 1,
          limit: VIDEOS_PER_PAGE,
        });
        console.log(
          `Raw videos for ${collectionId}:`,
          JSON.stringify(apiVideos, null, 2),
        );

        setSelectedCollectionTotalVideos(apiVideos.total || 0);

        const formattedVideos = apiVideos.data.map(video => ({
          id: video.identifier,
          title:
            getMetaValue(
              video.metas,
              'http://nakala.fr/terms#title',
              i18n.language,
            ) || t('common:titleUnavailable'),
          date:
            getMetaValue(video.metas, 'http://nakala.fr/terms#created') ||
            video.creDate ||
            new Date().toISOString(),
          duration: '-',
          description:
            getMetaValue(
              video.metas,
              'http://purl.org/dc/terms/description',
              i18n.language,
            ) || '',
          thumbnail: '/images/videos/placeholder-video.jpg',
          tags: getMetaValues(video.metas, 'http://purl.org/dc/terms/subject'),
        }));
        setCollectionVideos(formattedVideos);
      } catch (err) {
        console.error(
          `Failed to fetch videos for collection ${collectionId}:`,
          err,
        );
        setSelectedCollectionTotalVideos(0);
      } finally {
        setIsLoadingVideos(false);
      }
    },
    [i18n.language, t, VIDEOS_PER_PAGE],
  );

  useEffect(() => {
    if (router.query.collection && !selectedCollection) {
      const collection = initialCollectionsData.find(
        c => c.id === router.query.collection,
      );
      if (collection) {
        setSelectedCollection(collection);
        fetchAndSetVideos(collection.id);
      }
    }

    if (router.query.tags) {
      setFilters(prev => ({
        ...prev,
        tags: router.query.tags.split(','),
      }));
    }

    if (router.query.sortBy) {
      setFilters(prev => ({
        ...prev,
        sortBy: router.query.sortBy,
      }));
    }

    if (router.query.page) {
      setCurrentPage(parseInt(router.query.page, 10) - 1);
    }

    if (router.query.search) {
      setSearchTerms(router.query.search);
    }

    const handleRouteChange = url => {
      if (
        url === '/projet/videos' ||
        (url.startsWith('/projet/videos?') && !url.includes('collection='))
      ) {
        setSelectedCollection(null);
        setCollectionVideos([]);
        setSelectedCollectionTotalVideos(0);
        setCurrentPage(0);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [
    router.query,
    router.events,
    selectedCollection,
    initialCollectionsData,
    fetchAndSetVideos,
  ]);

  // Effet additionnel pour recharger les vidéos lorsque la langue change
  useEffect(() => {
    if (selectedCollection) {
      fetchAndSetVideos(selectedCollection.id, currentPage);
    }
  }, [i18n.language, selectedCollection, currentPage, fetchAndSetVideos]);

  const filteredCollections = initialCollectionsData.filter(collection => {
    if (!searchTerms) return true;
    const search = searchTerms.toLowerCase();
    return (
      collection.title.toLowerCase().includes(search) ||
      (collection.description &&
        collection.description.toLowerCase().includes(search))
    );
  });

  const collectionsPageCount = Math.ceil(
    filteredCollections.length / COLLECTIONS_PER_PAGE,
  );
  const paginatedCollections = filteredCollections.slice(
    currentPage * COLLECTIONS_PER_PAGE,
    (currentPage + 1) * COLLECTIONS_PER_PAGE,
  );

  const videosPageCount = selectedCollection
    ? Math.ceil(selectedCollectionTotalVideos / VIDEOS_PER_PAGE)
    : 0;

  const filteredAndSortedVideos = collectionVideos
    .filter(video => {
      if (searchTerms) {
        const search = searchTerms.toLowerCase();
        if (
          !video.title.toLowerCase().includes(search) &&
          !video.description.toLowerCase().includes(search)
        ) {
          return false;
        }
      }
      if (filters.tags.length > 0) {
        return filters.tags.some(tag => video.tags.includes(tag));
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const finalVideosPageCount =
    searchTerms || filters.tags.length > 0
      ? Math.ceil(filteredAndSortedVideos.length / VIDEOS_PER_PAGE)
      : videosPageCount;

  const paginatedVideos =
    searchTerms || filters.tags.length > 0
      ? filteredAndSortedVideos.slice(
          currentPage * VIDEOS_PER_PAGE,
          (currentPage + 1) * VIDEOS_PER_PAGE,
        )
      : collectionVideos;

  const handleCollectionClick = useCallback(
    async collection => {
      setSelectedCollection(collection);
      setCurrentPage(0);
      router.push(
        `/projet/videos?${stringifyQuery({ collection: collection.id, page: 1 })}`,
        undefined,
        { shallow: true },
      );
      await fetchAndSetVideos(collection.id, 0);
      setFilters({ tags: [], sortBy: 'date' });
    },
    [router],
  );

  const handlePageChange = useCallback(
    page => {
      const newPage = page.selected;
      setCurrentPage(newPage);
      const currentCollectionId = selectedCollection
        ? selectedCollection.id
        : undefined;

      if (currentCollectionId && !searchTerms && filters.tags.length === 0) {
        fetchAndSetVideos(currentCollectionId, newPage);
      }

      router.push(
        `/projet/videos?${stringifyQuery({
          collection: currentCollectionId,
          page: newPage + 1,
          search: searchTerms,
          tags: filters.tags.join(','),
          sortBy: filters.sortBy,
        })}`,
        undefined,
        { shallow: true },
      );
    },
    [router, selectedCollection, searchTerms, filters],
  );

  const handleFilterChange = useCallback(
    (value, { name }) => {
      const newFilters = { ...filters };
      if (name === 'tags') {
        newFilters.tags = value?.map(tag => tag.id) || [];
      } else if (name === 'sortBy') {
        newFilters.sortBy = value ? value.id : 'date';
      }
      setFilters(newFilters);
      setCurrentPage(0);
      router.push(
        `/projet/videos?${stringifyQuery({
          collection: selectedCollection?.id,
          page: 1,
          search: searchTerms,
          tags: newFilters.tags.join(','),
          sortBy: newFilters.sortBy,
        })}`,
        undefined,
        { shallow: true },
      );
    },
    [router, selectedCollection, searchTerms, filters],
  );

  const getDynamicFiltersFromTags = videos => {
    const tags = new Set();
    videos.forEach(video => {
      if (Array.isArray(video.tags)) {
        video.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).map(tag => ({ id: tag, title: tag }));
  };

  const renderContent = () => {
    if (error) {
      return (
        <NoResults
          title={t('common:error.title')}
          message={t('common:error.loadingData', { error: error })}
        />
      );
    }

    if (!selectedCollection) {
      return (
        <>
          <header className={styles.header}>
            <h1 className={styles.title}>{t('project:mainNav.videos')}</h1>
            <p className={styles.paragraph}>
              {t('project:videos.exploreIntro')}
            </p>
          </header>

          <div className={styles.videosHeader}>
            <div className={styles.videosHeaderPageCount}>
              {filteredCollections.length === 0
                ? t('project:videos.noCollections')
                : filteredCollections.length === 1
                  ? t('project:videos.oneCollection')
                  : `${filteredCollections.length} ${t('common:collections')}`}
            </div>
          </div>

          {paginatedCollections.length > 0 ? (
            <div className={styles.section}>
              <div className={styles.videoGrid}>
                {paginatedCollections.map(collection => (
                  <div
                    key={collection.id}
                    className={styles.videoCard}
                    onClick={() => handleCollectionClick(collection)}
                    onKeyDown={e =>
                      e.key === 'Enter' && handleCollectionClick(collection)
                    }
                    tabIndex="0"
                    role="button"
                    aria-label={t('project:videos.viewCollectionAria', {
                      title: collection.title,
                    })}
                  >
                    <div className={styles.videoThumbnail}>
                      {collection.videoCount > 0 && (
                        <div className={styles.videoCountBadge}>
                          {collection.videoCount === 1
                            ? `1 ${t('project:videos.video')}`
                            : `${collection.videoCount} ${t('project:videos.video_plural')}`}
                        </div>
                      )}
                      <div className={styles.collectionImagePlaceholder}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className={styles.videoInfo}>
                      <h3 className={styles.videoTitle}>{collection.title}</h3>
                      <p className={styles.videoDate}>
                        {new Date(collection.date).toLocaleDateString()}
                      </p>
                      <p className={styles.videoDescription}>
                        {collection.description ||
                          t('common:descriptionUnavailable')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {collectionsPageCount > 1 && (
                <div className={styles.paginationContainer}>
                  <Pagination
                    forcePage={currentPage}
                    pageCount={collectionsPageCount}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <NoResults
              icon="search"
              title={t('common:error.dataNotFound')}
              message={t('common:error.noResultsFound')}
            />
          )}
        </>
      );
    } else {
      const tagOptions = getDynamicFiltersFromTags(collectionVideos);
      return (
        <>
          <div className={styles.breadcrumbs}>
            <Link href="/projet/videos">
              <span className={styles.breadcrumbItemText}>
                {t('project:mainNav.videos')}
              </span>
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>
              <span className={styles.breadcrumbItemText}>
                {selectedCollection.title}
              </span>
            </span>
          </div>

          <div className={styles.collectionHeader}>
            <div className={styles.collectionHeaderContent}>
              <h1 className={styles.title}>{selectedCollection.title}</h1>
              {selectedCollection.description && (
                <div className={styles.descriptionContainer}>
                  <p
                    className={`${styles.paragraph} ${!isDescriptionExpanded ? styles.collapsedText : ''}`}
                  >
                    {selectedCollection.description}
                  </p>
                  <button
                    className={styles.toggleButton}
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    aria-expanded={isDescriptionExpanded}
                  >
                    {isDescriptionExpanded
                      ? t('common:seeLess')
                      : t('common:seeMore')}
                  </button>
                </div>
              )}
              {!selectedCollection.description && (
                <p className={styles.paragraph}>
                  {t('common:descriptionUnavailable')}
                </p>
              )}
            </div>
          </div>

          <div className={styles.videosHeader}>
            <div className={styles.videosHeaderPageCount}>
              {selectedCollectionTotalVideos === 0
                ? isLoadingVideos
                  ? t('common:loading')
                  : t('project:videos.noVideos')
                : selectedCollectionTotalVideos === 1
                  ? t('project:videos.oneVideoTotal')
                  : t('project:videos.videosTotal', {
                      count: selectedCollectionTotalVideos,
                    })}
            </div>

            <div className={styles.videosHeaderRight}>
              <div className={styles.filterMenu}>
                <FilterSelect
                  inverse={false}
                  name="tags"
                  value={tagOptions.filter(tag =>
                    filters.tags.includes(tag.id),
                  )}
                  options={tagOptions}
                  isMulti={true}
                  isClearable={true}
                  placeholder={t('common:filters.filterByTag')}
                  onChange={handleFilterChange}
                  isSearchable={true}
                  className={styles.customSelect}
                  classNamePrefix="filter"
                  theme={theme => ({
                    ...theme,
                    borderRadius: 4,
                    colors: {
                      ...theme.colors,
                      primary: '#1e3a8a',
                      primary75: '#3152a8',
                      primary50: '#cbd5e1',
                      primary25: '#f1f5f9',
                    },
                  })}
                />
              </div>

              <div className={styles.sortMenu}>
                <FilterSelect
                  inverse={false}
                  name="sortBy"
                  value={[
                    { id: 'date', title: t('common:date') },
                    { id: 'title', title: t('common:title') },
                  ].find(o => o.id === filters.sortBy)}
                  options={[
                    { id: 'date', title: t('common:date') },
                    { id: 'title', title: t('common:title') },
                  ]}
                  isMulti={false}
                  isClearable={false}
                  isSearchable={false}
                  isDisabled={
                    isLoadingVideos || filteredAndSortedVideos.length === 0
                  }
                  onChange={handleFilterChange}
                  className={styles.customSelect}
                  classNamePrefix="filter"
                  theme={theme => ({
                    ...theme,
                    borderRadius: 4,
                    colors: {
                      ...theme.colors,
                      primary: '#1e3a8a',
                      primary75: '#3152a8',
                      primary50: '#cbd5e1',
                      primary25: '#f1f5f9',
                    },
                  })}
                />
              </div>
            </div>
          </div>

          {isLoadingVideos ? (
            <div className={styles.loadingContainer}>
              <p>{t('project:videos.loadingVideos')}</p>
            </div>
          ) : paginatedVideos.length > 0 ? (
            <>
              <div className={styles.videoGrid}>
                {paginatedVideos.map(video => (
                  <Link
                    key={video.id}
                    href={`/projet/videos/${encodeURIComponent(video.id)}`}
                    className={styles.videoCard}
                  >
                    <div className={styles.videoThumbnail}>
                      <div className={styles.videoImagePlaceholder}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className={styles.videoInfo}>
                      <h3 className={styles.videoTitle}>{video.title}</h3>
                      <p className={styles.videoDate}>
                        {new Date(video.date).toLocaleDateString()}
                      </p>
                      <p className={styles.videoDescription}>
                        {video.description}
                      </p>
                      <div className={styles.videoTags}>
                        {Array.isArray(video.tags) && (
                          <>
                            {video.tags.slice(0, 3).map(tag => (
                              <span key={tag} className={styles.videoTag}>
                                {tag}
                              </span>
                            ))}
                            {video.tags.length > 3 && (
                              <span key="ellipsis" className={styles.videoTag}>
                                ...
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {finalVideosPageCount > 1 && (
                <div className={styles.paginationContainer}>
                  <Pagination
                    forcePage={currentPage}
                    pageCount={finalVideosPageCount}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <NoResults
              icon="search"
              title={t('common:error.dataNotFound')}
              message={t('common:error.noResultsFound')}
            />
          )}
        </>
      );
    }
  };

  return (
    <ProjectLayout
      title={t('project:mainNav.videos')}
      metaDescription={t('project:videos.metaDescription')}
      hideNav={!!selectedCollection}
    >
      <div className={styles.container}>
        <div className={styles.mainContent}>{renderContent()}</div>
      </div>
    </ProjectLayout>
  );
};

export async function getStaticProps({ locale }) {
  const currentLang = locale || 'fr';
  try {
    const collectionsPromises = Object.values(NAKALA_COLLECTIONS).map(
      async id => {
        const [collectionData, videoCount] = await Promise.all([
          fetchCollection(id),
          fetchCollectionVideoCount(id),
        ]);

        console.log(
          `Fetched collection ${id}:`,
          JSON.stringify(collectionData, null, 2),
        );
        console.log(`Video count for ${id}: ${videoCount}`);

        return {
          id: collectionData.identifier,
          title:
            getMetaValue(
              collectionData.metas,
              'http://nakala.fr/terms#title',
              currentLang,
            ) || 'Titre Indisponible',
          description: getMetaValue(
            collectionData.metas,
            'http://purl.org/dc/terms/description',
            currentLang,
          ),
          date: collectionData.creDate,
          videoCount: videoCount,
        };
      },
    );

    const initialCollectionsData = await Promise.all(collectionsPromises);
    console.log(
      'Processed Collections with counts:',
      JSON.stringify(initialCollectionsData, null, 2),
    );

    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'project',
          'home',
        ])),
        initialCollectionsData,
        error: null,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching Nakala data in getStaticProps:', error);
    const errorMessage = error.message || error.toString();
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'project',
          'home',
        ])),
        initialCollectionsData: [],
        error: errorMessage,
      },
      revalidate: 60,
    };
  }
}

export default VideosPage;
