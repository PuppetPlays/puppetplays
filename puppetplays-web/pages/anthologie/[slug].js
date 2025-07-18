import Footer from 'components/Footer';
import Layout from 'components/Layout';
import NoResults from 'components/NoResults';
import { fetchAPI } from 'lib/api';
import { fetchNakalaItem, getNakalaEmbedUrl, getMetaValue } from 'lib/nakala';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Fragment, useState, useEffect } from 'react';
import styles from 'styles/Anthology.module.scss';

// Utility function to ensure safe serialization for Next.js JSON
const safeSerialize = (value, defaultValue = null) => {
  if (value === undefined || value === '') {
    return defaultValue;
  }
  return value;
};

// Helper function to get elements by tag name (replacement for querySelectorAll)
const getElementsByTagName = (element, tagName) => {
  const results = [];

  function traverse(node) {
    if (node.tagName && node.tagName.toLowerCase() === tagName.toLowerCase()) {
      results.push(node);
    }

    if (node.childNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        traverse(node.childNodes[i]);
      }
    }
  }

  traverse(element);
  return results;
};

// Helper function to get first element by tag name (replacement for querySelector)
const getElementByTagName = (element, tagName) => {
  function traverse(node) {
    if (node.tagName && node.tagName.toLowerCase() === tagName.toLowerCase()) {
      return node;
    }

    if (node.childNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const result = traverse(node.childNodes[i]);
        if (result) return result;
      }
    }

    return null;
  }

  return traverse(element);
};

// Parse XML transcription to extract pages with proper TEI/pb handling
const parseXMLTranscription = xmlContent => {
  if (!xmlContent) return [];

  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || !window.DOMParser) {
      console.error('DOMParser not available - must be client-side');
      return [];
    }

    console.log('🔍 [DEBUG] Starting tested XML parsing...');

    // Create a DOM parser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

    // Find all page breaks using tested method
    const pageBreaks = getElementsByTagName(xmlDoc, 'pb');
    console.log('🔍 [DEBUG] Found page breaks:', pageBreaks.length);

    if (pageBreaks.length === 0) {
      console.error('No page breaks found in XML');
      return [];
    }

    // Process content by page
    const pages = [];

    for (let i = 0; i < pageBreaks.length; i++) {
      const currentPb = pageBreaks[i];
      const nextPb = pageBreaks[i + 1];
      const pageNumber = currentPb.getAttribute('n');

      console.log(`🔍 [DEBUG] Processing page ${pageNumber}`);

      const pageContent = extractPageContent(xmlDoc, currentPb, nextPb);

      pages.push({
        pageNumber: parseInt(pageNumber),
        facsimile: currentPb.getAttribute('facs'),
        content: pageContent,
      });

      console.log(
        `🔍 [DEBUG] Page ${pageNumber} has ${pageContent.length} content items`,
      );
    }

    return pages;
  } catch (error) {
    console.error('Error parsing XML transcription:', error);
    return [];
  }
};

// Extract content for a single page, preserving hierarchy
const extractPageContent = (xmlDoc, currentPb, nextPb) => {
  const content = [];

  // Collect all elements in document order
  const allElements = [];

  function collectElements(node) {
    if (node.tagName) {
      allElements.push(node);
    }
    if (node.childNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        collectElements(node.childNodes[i]);
      }
    }
  }

  collectElements(xmlDoc.documentElement);

  // Find the index of current and next page breaks
  const currentIndex = allElements.indexOf(currentPb);
  const nextIndex = nextPb ? allElements.indexOf(nextPb) : allElements.length;

  if (currentIndex === -1) return content;

  // Process elements between the page breaks
  for (let i = currentIndex + 1; i < nextIndex; i++) {
    const element = allElements[i];
    const processed = processElement(element);
    if (processed) {
      if (Array.isArray(processed)) {
        content.push(...processed);
      } else {
        content.push(processed);
      }
    }
  }

  return content;
};

// Process a single element and return styled content
const processElement = element => {
  const tagName = element.tagName.toLowerCase();

  // Skip if this element is contained within another element we'll process
  if (isNestedInProcessableElement(element)) {
    return null;
  }

  switch (tagName) {
    case 'docauthor':
      return {
        type: 'author',
        content: `Auteur : ${element.textContent.trim()}`,
      };

    case 'doctitle':
      const titleParts = getElementsByTagName(element, 'titlepart');
      const titleResults = [];
      for (const part of titleParts) {
        const type = part.getAttribute('type');
        if (type === 'main') {
          titleResults.push({
            type: 'title',
            content: part.textContent.trim(),
          });
        } else if (type === 'sub') {
          titleResults.push({
            type: 'subtitle',
            content: part.textContent.trim(),
          });
        }
      }
      return titleResults.length > 0 ? titleResults : null;

    case 'docdate':
      // Don't return date separately, it will be handled by a special function
      return {
        type: 'date',
        content: element.textContent.trim(),
        skipRender: true,
      };

    case 'head':
      const headType = element.getAttribute('type');
      if (headType === 'tableau') {
        return { type: 'heading', content: element.textContent.trim() };
      } else if (headType === 'scene') {
        return { type: 'sceneHeading', content: element.textContent.trim() };
      } else if (headType === 'personnage') {
        return { type: 'heading', content: element.textContent.trim() };
      } else if (headType === 'div5') {
        return { type: 'heading', content: element.textContent.trim() };
      }
      return { type: 'heading', content: element.textContent.trim() };

    case 'castlist':
      const roles = [];
      const castItems = getElementsByTagName(element, 'castitem');
      const castHead = getElementByTagName(element, 'head');

      // First add the heading if present
      const results = [];
      if (castHead) {
        results.push({ type: 'heading', content: castHead.textContent.trim() });
      }

      // Then add the cast list
      for (const item of castItems) {
        const role = getElementByTagName(item, 'role');
        const roleDesc = getElementByTagName(item, 'roledesc');
        if (role) {
          const roleText = role.textContent.trim();
          const description = roleDesc ? roleDesc.textContent.trim() : '';

          // Combine role and description - role already contains comma in XML
          const formattedText = description
            ? `${roleText} ${description}`
            : roleText;

          roles.push({
            role: roleText,
            roleDesc: description,
            fullText: formattedText,
          });
        }
      }

      if (roles.length > 0) {
        results.push({ type: 'castList', content: roles });
      }

      return results.length > 0 ? results : null;

    case 'set':
      // Handle set elements (décors)
      const setParagraphs = getElementsByTagName(element, 'p');
      if (setParagraphs.length > 0) {
        return { type: 'stage', content: setParagraphs[0].textContent.trim() };
      }
      return { type: 'stage', content: element.textContent.trim() };

    case 'stage':
      // Only process standalone stage directions, not those nested in paragraphs
      if (element.parentNode.tagName.toLowerCase() === 'p') {
        return null; // Will be handled by the paragraph
      }
      return { type: 'stage', content: element.textContent.trim() };

    case 'sp':
      // Speech element - process speaker and paragraphs together
      const speaker = getElementByTagName(element, 'speaker');
      const paragraphs = getElementsByTagName(element, 'p');
      const speechResults = [];

      if (speaker) {
        speechResults.push({
          type: 'speaker',
          content: speaker.textContent.trim().toUpperCase(),
        });
      }

      // Process each paragraph, handling nested stage directions
      for (const p of paragraphs) {
        const pContent = processParagramWithStage(p);
        if (pContent) {
          speechResults.push(...pContent);
        }
      }

      return speechResults;

    case 'lg':
      // Verse group
      const lines = getElementsByTagName(element, 'l');
      const verses = [];
      for (const line of lines) {
        verses.push(line.textContent.trim());
      }
      return verses.length > 0 ? { type: 'verse', content: verses } : null;

    default:
      return null;
  }
};

// Process a paragraph that might contain nested stage directions
const processParagramWithStage = paragraph => {
  const result = [];
  const childNodes = Array.from(paragraph.childNodes);

  let currentText = '';

  for (const node of childNodes) {
    if (node.nodeType === 3) {
      // Text node
      currentText += node.textContent;
    } else if (node.nodeType === 1) {
      // Element node
      if (node.tagName.toLowerCase() === 'stage') {
        // Save accumulated text
        if (currentText.trim()) {
          result.push({ type: 'text', content: currentText.trim() });
          currentText = '';
        }
        // Add stage direction
        result.push({ type: 'stage', content: node.textContent.trim() });
      } else {
        // Other elements, just add their text
        currentText += node.textContent;
      }
    }
  }

  // Add remaining text
  if (currentText.trim()) {
    result.push({ type: 'text', content: currentText.trim() });
  }

  return result;
};

// Check if element is nested in another processable element
const isNestedInProcessableElement = element => {
  const processableTags = ['sp', 'castlist', 'doctitle', 'lg'];
  let parent = element.parentNode;

  while (parent && parent.tagName) {
    if (processableTags.includes(parent.tagName.toLowerCase())) {
      return true;
    }
    parent = parent.parentNode;
  }

  return false;
};

// GraphQL query to get anthology entry by slug
const getAnthologyBySlugQuery = `
  query GetAnthologyBySlug($slug: [String], $site: [String]) {
    entries(section: "anthology", slug: $slug, site: $site) {
      ... on anthology_default_Entry {
        id
        title
        slug
        uri
        editors {
          id
          title
        ... on persons_persons_Entry { 
            firstName
            lastName
          usualName
        }
        }
        transcribers {
          id
        title 
          ... on persons_persons_Entry {
            firstName
            lastName
            usualName
        }
      }
        license
        doi
    }
  }
}
`;

const AnthologyDetailPage = ({ anthologyData, error }) => {
  const { t } = useTranslation(['common', 'anthology']);
  const [nakalaViewerUrl, setNakalaViewerUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [transcriptionPages, setTranscriptionPages] = useState([]);
  const [xmlContent, setXmlContent] = useState('');
  const [isLoadingTranscription, setIsLoadingTranscription] = useState(false);

  // Effect to initialize viewer and fetch document metadata
  useEffect(() => {
    if (
      anthologyData &&
      anthologyData.nakalaIdentifier &&
      anthologyData.nakalaFileIdentifier
    ) {
      const initializeViewer = async () => {
        setIsLoadingPages(true);

        try {
          // Get basic viewer URL
          const baseViewerUrl = getNakalaEmbedUrl(
            anthologyData.nakalaIdentifier,
            anthologyData.nakalaFileIdentifier,
            {
              buttons: true,
            },
          );

          setNakalaViewerUrl(baseViewerUrl);

          // Try to fetch additional metadata to determine page count
          if (anthologyData.nakalaData && anthologyData.nakalaData.files) {
            // Count image files to estimate pages
            const imageFiles = anthologyData.nakalaData.files.filter(
              file => file.mime_type && file.mime_type.startsWith('image/'),
            );

            if (imageFiles.length > 0) {
              setTotalPages(imageFiles.length);
            }
          }
        } catch (error) {
          console.error('Error initializing viewer:', error);
        } finally {
          setIsLoadingPages(false);
        }
      };

      initializeViewer();
    }
  }, [anthologyData]);

  // Effect to update viewer URL when page changes
  useEffect(() => {
    if (
      anthologyData &&
      anthologyData.nakalaIdentifier &&
      anthologyData.nakalaFileIdentifier &&
      currentPage > 0
    ) {
      // Build IIIF Content State URL for specific page
      // IIIF viewers typically support URL fragments or query parameters for navigation
      const baseUrl = getNakalaEmbedUrl(
        anthologyData.nakalaIdentifier,
        anthologyData.nakalaFileIdentifier,
        {
          buttons: true,
        },
      );

      // Add page parameter if not on first page
      const pageUrl =
        currentPage > 1 ? `${baseUrl}&page=${currentPage}` : baseUrl;

      setNakalaViewerUrl(pageUrl);
    }
  }, [currentPage, anthologyData]);

  // Effect to load and parse XML transcription
  useEffect(() => {
    const loadTranscription = async () => {
      console.log('🔍 [DEBUG] Starting transcription loading...');
      console.log('🔍 [DEBUG] anthologyData:', anthologyData);
      console.log(
        '🔍 [DEBUG] transcriptionFiles:',
        anthologyData?.transcriptionFiles,
      );

      if (!anthologyData?.transcriptionFiles?.length) {
        console.log('🔍 [DEBUG] No transcription files found');
        return;
      }

      setIsLoadingTranscription(true);
      try {
        const transcriptionFile = anthologyData.transcriptionFiles[0]; // Use first XML file
        console.log('🔍 [DEBUG] Using transcription file:', transcriptionFile);

        if (!transcriptionFile.url) {
          console.error('🔍 [DEBUG] No URL found for transcription file');
          console.error(
            '🔍 [DEBUG] Available transcription file data:',
            transcriptionFile,
          );
          // Don't throw error, just set empty transcription
          setTranscriptionPages([]);
          return;
        }

        console.log('🔍 [DEBUG] Fetching from URL:', transcriptionFile.url);

        let xmlText = '';
        let response;

        // Use the transcription file URL
        response = await fetch(transcriptionFile.url);

        if (!response.ok) {
          console.error(
            '🔍 [DEBUG] Fetch failed:',
            response.status,
            response.statusText,
          );
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        xmlText = await response.text();
        console.log('🔍 [DEBUG] XML text length:', xmlText.length);
        console.log('🔍 [DEBUG] XML starts with:', xmlText.substring(0, 200));

        setXmlContent(xmlText);
        const pages = parseXMLTranscription(xmlText);
        console.log('🔍 [DEBUG] Parsed pages:', pages);
        setTranscriptionPages(pages);

        console.log('📖 Transcription pages loaded:', pages.length);
        console.log(
          '📖 First page sample:',
          pages[0]?.content?.length,
          'items',
        );
        if (pages[0]?.content?.length > 0) {
          console.log('📖 First page first item:', pages[0].content[0]);
        }
      } catch (error) {
        console.error('🔍 [DEBUG] Error loading transcription:', error);
        console.error('🔍 [DEBUG] Error details:', {
          message: error.message,
          stack: error.stack,
          url: anthologyData?.transcriptionFiles?.[0]?.url,
        });
      } finally {
        setIsLoadingTranscription(false);
      }
    };

    loadTranscription();
  }, [anthologyData]);

  // Navigation handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const _handleGoToPage = pageNumber => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (error) {
    return (
      <Layout
        title={t('anthology:anthologyNotFound')}
        metaDescription={t('anthology:anthologyNotFoundDescription')}
      >
        <Head>
          <title>{`${t('anthology:anthologyNotFound')} | Puppetplays`}</title>
        </Head>
        <div className={styles.container}>
          <NoResults title={t('anthology:anthologyNotFound')} message={error} />
          <Link href="/anthologie" className={styles.backLink}>
            {t('anthology:backToAnthology')}
          </Link>
        </div>
      </Layout>
    );
  }

  if (!anthologyData) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>{t('common:loading')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Fragment>
      <Layout
        title={anthologyData.title}
        metaDescription={`Anthologie: ${anthologyData.title}`}
      >
        <Head>
          <title>{`${anthologyData.title} | Puppetplays`}</title>
          <meta
            name="description"
            content={`Anthologie: ${anthologyData.title}`}
          />
        </Head>

        <div className={styles.container}>
          {/* Breadcrumbs */}
          <div className={styles.breadcrumbs}>
            <Link href="/anthologie">
              <span className={styles.breadcrumbItemText}>
                {t('anthology:title')}
              </span>
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>
              <span className={styles.breadcrumbItemText}>
                {anthologyData.title}
              </span>
            </span>
          </div>

          {/* Anthology Header */}
          <header className={styles.playHeader}>
            <h1 className={styles.playTitle}>{anthologyData.title}</h1>
            <div className={styles.playMeta}>
              {anthologyData.editorsDisplay && (
                <p className={styles.playAuthor}>
                  <strong>{t('anthology:compiler')}:</strong>{' '}
                  {anthologyData.editorsDisplay}
                </p>
              )}
              {anthologyData.transcribersDisplay && (
                <p className={styles.playAuthor}>
                  <strong>{t('anthology:transcriber')}:</strong>{' '}
                  {anthologyData.transcribersDisplay}
                </p>
              )}
              {anthologyData.license && (
                <p className={styles.playInfo}>
                  <strong>{t('anthology:license')}:</strong>{' '}
                  {anthologyData.license}
                </p>
              )}
              {anthologyData.nakalaMetadata?.created && (
                <p className={styles.playInfo}>
                  <strong>{t('anthology:nakalaYear')}:</strong>{' '}
                  {anthologyData.nakalaMetadata.created}
                </p>
              )}
              {anthologyData.nakalaMetadata?.description && (
                <p className={styles.playDescription}>
                  <strong>{t('anthology:nakalaDescription')}:</strong>{' '}
                  {anthologyData.nakalaMetadata.description}
                </p>
              )}
            </div>
          </header>

          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Viewer Section - Full Width */}
            <div className={styles.viewerSection}>
              <div className={styles.viewerHeader}>
                <h2 className={styles.sectionTitle}>
                  {t('anthology:digitalizedDocument')}
                </h2>

                {/* Page Navigation Controls */}
                {totalPages > 1 && !isLoadingPages && (
                  <div className={styles.viewerControls}>
                    <div className={styles.pageNavigation}>
                      <button
                        type="button"
                        className={styles.navButton}
                        onClick={handlePreviousPage}
                        disabled={currentPage <= 1}
                        title={t('anthology:previousPage')}
                      >
                        ‹ {t('anthology:previousPage')}
                      </button>

                      <span className={styles.pageIndicator}>
                        {t('anthology:page')} {currentPage} / {totalPages}
                      </span>

                      <button
                        type="button"
                        className={styles.navButton}
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages}
                        title={t('anthology:nextPage')}
                      >
                        {t('anthology:nextPage')} ›
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {nakalaViewerUrl ? (
                <div className={styles.viewerContainer}>
                  <iframe
                    src={nakalaViewerUrl}
                    title={`${t('anthology:digitalizedDocument')} - ${t('anthology:page')} ${currentPage}`}
                    className={styles.viewerFrame}
                    allowFullScreen
                    key={`page-${currentPage}`} // Force reload on page change
                  />
                </div>
              ) : (
                <div className={styles.noViewer}>
                  <p>
                    {isLoadingPages
                      ? t('anthology:loadingViewer')
                      : t('anthology:loadingViewer')}
                  </p>
                </div>
              )}
            </div>

            {/* Transcription Section - Sidebar */}
            <div className={styles.transcriptionSection}>
              <div className={styles.transcriptionHeader}>
                <h3 className={styles.sectionTitle}>
                  {t('anthology:transcription')}
                </h3>
                {transcriptionPages.length > 0 && (
                  <div className={styles.transcriptionPageInfo}>
                    Page {currentPage} de {transcriptionPages.length}
                  </div>
                )}
              </div>

              {isLoadingTranscription ? (
                <div className={styles.transcriptionLoading}>
                  <p>Chargement de la transcription...</p>
                </div>
              ) : transcriptionPages.length > 0 ? (
                <div className={styles.transcriptionContent}>
                  {(() => {
                    const currentTranscriptionPage = transcriptionPages.find(
                      page => page.pageNumber === currentPage,
                    );

                    if (currentTranscriptionPage) {
                      return (
                        <div className={styles.transcriptionText}>
                          <div className={styles.transcriptionBody}>
                            {(() => {
                              const content = currentTranscriptionPage.content;
                              const elements = [];

                              for (let i = 0; i < content.length; i++) {
                                const item = content[i];

                                if (item.type === 'author') {
                                  elements.push(
                                    <p key={i} className={styles.author}>
                                      {item.content}
                                    </p>,
                                  );
                                } else if (item.type === 'title') {
                                  elements.push(
                                    <p key={i} className={styles.title}>
                                      {item.content}
                                    </p>,
                                  );
                                } else if (item.type === 'subtitle') {
                                  // Check if next item is a date, if so combine them
                                  const nextItem = content[i + 1];
                                  if (nextItem && nextItem.type === 'date') {
                                    elements.push(
                                      <div
                                        key={i}
                                        className={styles.subtitleWithDate}
                                      >
                                        <p className={styles.subtitle}>
                                          {item.content}
                                        </p>
                                        <p className={styles.date}>
                                          {nextItem.content}
                                        </p>
                                      </div>,
                                    );
                                    i++; // Skip the next date item since we've processed it
                                  } else {
                                    elements.push(
                                      <p key={i} className={styles.subtitle}>
                                        {item.content}
                                      </p>,
                                    );
                                  }
                                } else if (item.type === 'date') {
                                  // Only render date if it wasn't combined with subtitle
                                  elements.push(
                                    <p key={i} className={styles.date}>
                                      {item.content}
                                    </p>,
                                  );
                                } else if (item.type === 'heading') {
                                  elements.push(
                                    <p key={i} className={styles.heading}>
                                      {item.content}
                                    </p>,
                                  );
                                } else if (item.type === 'sceneHeading') {
                                  elements.push(
                                    <p key={i} className={styles.sceneHeading}>
                                      {item.content}
                                    </p>,
                                  );
                                } else if (item.type === 'castList') {
                                  elements.push(
                                    <div key={i} className={styles.castList}>
                                      {item.content.map((role, roleIndex) => (
                                        <p
                                          key={roleIndex}
                                          className={styles.castItem}
                                        >
                                          <span className={styles.role}>
                                            {role.fullText}
                                          </span>
                                        </p>
                                      ))}
                                    </div>,
                                  );
                                } else if (item.type === 'stage') {
                                  elements.push(
                                    <p key={i} className={styles.stage}>
                                      {item.content}
                                    </p>,
                                  );
                                } else if (item.type === 'speaker') {
                                  elements.push(
                                    <p key={i} className={styles.speaker}>
                                      {item.content}
                                    </p>,
                                  );
                                } else if (item.type === 'text') {
                                  elements.push(
                                    <p key={i} className={styles.text}>
                                      {item.content}
                                    </p>,
                                  );
                                } else if (item.type === 'verse') {
                                  elements.push(
                                    <div key={i} className={styles.verse}>
                                      {item.content.map((line, lineIndex) => (
                                        <p
                                          key={lineIndex}
                                          className={styles.line}
                                        >
                                          {line.startsWith('♪ ')
                                            ? line.slice(2)
                                            : line}
                                        </p>
                                      ))}
                                    </div>,
                                  );
                                }
                              }

                              return elements;
                            })()}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className={styles.transcriptionPlaceholder}>
                          <p>Aucune transcription disponible pour cette page</p>
                        </div>
                      );
                    }
                  })()}
                </div>
              ) : anthologyData?.transcriptionFiles?.length > 0 ? (
                <div className={styles.transcriptionError}>
                  <p>Erreur lors du chargement de la transcription</p>
                  <small>Veuillez réessayer plus tard</small>
                </div>
              ) : (
                <div className={styles.transcriptionPlaceholder}>
                  <p>{t('anthology:noTranscriptionAvailable')}</p>
                  <small>
                    La transcription n'est pas disponible pour cette œuvre
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* No Content Available */}
          {!nakalaViewerUrl &&
            anthologyData.transcriptionFiles.length === 0 && (
              <div className={styles.noContent}>
                <p>{t('anthology:noDigitalContentAvailable')}</p>
              </div>
            )}
        </div>

        <Footer />
      </Layout>
    </Fragment>
  );
};

export async function getServerSideProps({ params, locale }) {
  const { slug } = params;

  try {
    // First, fetch the anthology entry from CraftCMS
    const siteHandle = locale === 'fr' ? 'fr' : locale;
    const anthologyResponse = await fetchAPI(getAnthologyBySlugQuery, {
      slug: [slug],
      site: [siteHandle],
    });

    if (!anthologyResponse?.entries || anthologyResponse.entries.length === 0) {
      return {
        props: {
          ...(await serverSideTranslations(locale, [
            'common',
            'anthology',
            'home',
          ])),
          anthologyData: null,
          error: 'Anthology not found',
        },
      };
    }

    const anthology = anthologyResponse.entries[0];

    // Extract Nakala identifiers from DOI
    let nakalaIdentifier = null;
    let nakalaFileIdentifier = null;
    if (anthology.doi) {
      // DOI format includes both dataset and file identifier: "10.34847/nkl.xxxxxxxx/filesha1"
      const doiMatch = anthology.doi.match(/(10\.34847\/nkl\.[^/]+)\/(.+)/);
      if (doiMatch) {
        nakalaIdentifier = doiMatch[1]; // Dataset identifier: 10.34847/nkl.14b5rpso
        nakalaFileIdentifier = doiMatch[2]; // File identifier: a6251ee5c023450205416abd312f77db09500c94
      }
    }

    let nakalaData = null;
    const nakalaMetadata = {};
    const imageFiles = [];
    const transcriptionFiles = [];

    // If we have a Nakala identifier, fetch the data from Nakala
    if (nakalaIdentifier) {
      try {
        nakalaData = await fetchNakalaItem(nakalaIdentifier);

        // Debug: Log the full Nakala response
        console.log('=== NAKALA DEBUG START ===');
        console.log('Nakala identifier:', nakalaIdentifier);
        console.log('Full Nakala data:', JSON.stringify(nakalaData, null, 2));

        if (nakalaData.files) {
          console.log('Files found:', nakalaData.files.length);
          nakalaData.files.forEach((file, index) => {
            console.log(`File ${index}:`, {
              name: file.name,
              mime_type: file.mime_type,
              sha1: file.sha1,
              uri: file.uri,
              size: file.size,
            });
          });
        }
        console.log('=== NAKALA DEBUG END ===');

        // Extract useful metadata from Nakala
        if (nakalaData.metas) {
          const { metas } = nakalaData;
          nakalaMetadata.description =
            getMetaValue(metas, 'http://purl.org/dc/terms/description', 'fr') ||
            getMetaValue(metas, 'http://purl.org/dc/terms/description', 'en');
          nakalaMetadata.creator = getMetaValue(
            metas,
            'http://nakala.fr/terms#creator',
          );
          nakalaMetadata.created = getMetaValue(
            metas,
            'http://nakala.fr/terms#created',
          );
          nakalaMetadata.license = getMetaValue(
            metas,
            'http://nakala.fr/terms#license',
          );
          nakalaMetadata.title =
            getMetaValue(metas, 'http://nakala.fr/terms#title', 'fr') ||
            getMetaValue(metas, 'http://nakala.fr/terms#title', 'en');
        }

        // Process image and transcription files from Nakala
        if (nakalaData.files) {
          console.log('=== PROCESSING FILES ===');
          nakalaData.files.forEach((file, index) => {
            console.log(
              `Processing file ${index}:`,
              file.name,
              'MIME:',
              file.mime_type,
            );

            // Check for image files (JPG, PNG, etc.)
            if (
              file.mime_type &&
              file.mime_type.startsWith('image/') &&
              file.sha1
            ) {
              console.log(`✅ Adding image file: ${file.name}`);
              imageFiles.push({
                name: safeSerialize(file.name),
                sha1: safeSerialize(file.sha1),
                mimetype: safeSerialize(file.mime_type),
                size: safeSerialize(file.size),
              });
            }
            // Check for transcription files (XML)
            else if (
              file.mime_type === 'application/xml' ||
              file.mime_type === 'application/tei+xml' ||
              file.name.endsWith('.xml') ||
              file.name.toLowerCase().includes('.xml')
            ) {
              console.log(`✅ Adding XML transcription file: ${file.name}`);
              console.log(`🔍 [DEBUG] XML file URI: ${file.uri}`);
              console.log(`🔍 [DEBUG] XML file SHA1: ${file.sha1}`);
              console.log(`🔍 [DEBUG] XML file full data:`, file);

              // Extract language from filename if possible
              const langMatch = file.name.match(/[_-]([a-z]{2,3})\./i);
              const fileLanguage = langMatch
                ? langMatch[1].toLowerCase()
                : 'unknown';

              // Build Nakala file URL if uri is not available
              let fileUrl = file.uri;
              if (!fileUrl && file.sha1) {
                // Use the working Nakala URL format
                fileUrl = `https://api.nakala.fr/data/${nakalaIdentifier}/${file.sha1}`;
                console.log(`🔍 [DEBUG] Constructed URL: ${fileUrl}`);
              }

              transcriptionFiles.push({
                url: safeSerialize(fileUrl),
                language: safeSerialize(fileLanguage, 'unknown'),
                filename: safeSerialize(file.name),
                sha1: safeSerialize(file.sha1),
              });
            } else {
              console.log(
                `❌ File ${file.name} doesn't match any category. MIME: ${file.mime_type}`,
              );
            }
          });

          console.log(
            'Final counts - Images:',
            imageFiles.length,
            'Transcriptions:',
            transcriptionFiles.length,
          );
          console.log('=== PROCESSING FILES END ===');
        }
      } catch (nakalaError) {
        console.error('Error fetching Nakala data:', nakalaError);
      }
    }

    // Format editors and transcribers names
    const formatPersonName = person => {
      if (!person) return 'Inconnu';
      if (person.firstName && person.lastName) {
        return `${person.firstName} ${person.lastName}`;
      }
      if (person.usualName) return person.usualName;
      if (person.title) return person.title;
      return 'Inconnu';
    };

    const anthologyData = {
      id: anthology.id,
      slug: anthology.slug,
      title: anthology.title || 'Titre non disponible',
      editors: anthology.editors || [],
      transcribers: anthology.transcribers || [],
      license: safeSerialize(anthology.license),
      doi: safeSerialize(anthology.doi),
      nakalaIdentifier,
      nakalaFileIdentifier,
      nakalaMetadata: nakalaMetadata || {},
      nakalaData: nakalaData ? JSON.parse(JSON.stringify(nakalaData)) : null, // Clean nakala data for serialization
      imageFiles,
      transcriptionFiles,
      // Additional fields for display
      editorsDisplay: anthology.editors
        ? anthology.editors.map(formatPersonName).join(', ')
        : '',
      transcribersDisplay: anthology.transcribers
        ? anthology.transcribers.map(formatPersonName).join(', ')
        : '',
    };

    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'anthology',
          'home',
        ])),
        anthologyData,
        error: null,
      },
    };
  } catch (error) {
    console.error('Error fetching anthology data:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'anthology',
          'home',
        ])),
        anthologyData: null,
        error: error.message || "Erreur lors du chargement de l'anthologie",
      },
    };
  }
}

export default AnthologyDetailPage;
