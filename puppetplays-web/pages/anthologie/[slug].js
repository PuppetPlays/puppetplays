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

    // Find all page breaks using simple traversal
    const pageBreaks = getElementsByTagName(xmlDoc, 'pb');
    console.log('🔍 [DEBUG] Found page breaks:', pageBreaks.length);

    if (pageBreaks.length === 0) {
      console.error('No page breaks found in XML');
      return [];
    }

    // NEW APPROACH: Parse all content first, then distribute by pages
    // Step 1: Get all content elements in document order
    const allContentElements = extractAllContentElements(xmlDoc);
    console.log(`Found ${allContentElements.length} content elements total`);

    // Step 2: Create page mapping based on page breaks
    const pageMapping = createPageMapping(xmlDoc, pageBreaks);

    // Step 3: Distribute content to pages based on position
    const pages = distributeContentToPages(
      allContentElements,
      pageMapping,
      pageBreaks,
    );

    return pages;
  } catch (error) {
    console.error('Error parsing XML transcription:', error);
    return [];
  }
};

// Extract all meaningful content elements in document order
const extractAllContentElements = xmlDoc => {
  const contentElements = [];

  // Get the body or text element (skip header) using getElementsByTagName
  const bodies = getElementsByTagName(xmlDoc, 'body');
  const texts = getElementsByTagName(xmlDoc, 'text');
  const body =
    bodies.length > 0 ? bodies[0] : texts.length > 0 ? texts[0] : null;

  if (!body) {
    console.error('No body or text element found');
    return [];
  }

  // Traverse and collect all meaningful elements
  function traverse(node, depth = 0) {
    if (!node) return;

    // Skip page breaks themselves
    if (node.tagName && node.tagName.toLowerCase() === 'pb') {
      return;
    }

    // Check if this is a meaningful content element
    if (node.tagName && isContentElement(node)) {
      // Special case: div elements are just containers, process their children
      if (node.tagName.toLowerCase() === 'div') {
        // Don't process div itself, just traverse its children
      } else {
        const processed = processElement(node);
        if (processed) {
          if (Array.isArray(processed)) {
            contentElements.push(
              ...processed.map(item => ({
                ...item,
                originalElement: node,
                depth: depth,
              })),
            );
          } else {
            contentElements.push({
              ...processed,
              originalElement: node,
              depth: depth,
            });
          }
        }
      }
    }

    // Continue traversing children - always for div, only for non-content elements otherwise
    const shouldTraverseChildren =
      !node.tagName ||
      !isContentElement(node) ||
      node.tagName.toLowerCase() === 'div';

    if (shouldTraverseChildren && node.childNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        traverse(node.childNodes[i], depth + 1);
      }
    }
  }

  traverse(body);
  return contentElements;
};

// Check if an element should be treated as content
const isContentElement = element => {
  if (!element.tagName) return false;

  const contentTags = [
    'docauthor',
    'doctitle',
    'docdate',
    'head',
    'castlist',
    'set',
    'stage',
    'sp',
    'lg',
    'p',
    'div',
  ];

  return contentTags.includes(element.tagName.toLowerCase());
};

// Create mapping of document positions to page numbers
const createPageMapping = (xmlDoc, _pageBreaks) => {
  const mapping = new Map();

  // Simple recursive traversal instead of TreeWalker
  let currentPage = 1;

  function traverse(node) {
    if (!node) return;

    // Check if this node is a page break
    if (node.tagName && node.tagName.toLowerCase() === 'pb') {
      const pageNumber = node.getAttribute('n');
      if (pageNumber) {
        currentPage = parseInt(pageNumber);
      }
    }

    // Map this node to current page
    mapping.set(node, currentPage);

    // Traverse children
    if (node.childNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        traverse(node.childNodes[i]);
      }
    }
  }

  traverse(xmlDoc.documentElement);
  return mapping;
};

// Distribute content elements to appropriate pages
const distributeContentToPages = (
  contentElements,
  pageMapping,
  _pageBreaks,
) => {
  const _pages = [];
  const pageMap = new Map();

  // Initialize pages
  _pageBreaks.forEach(pb => {
    const pageNumber = parseInt(pb.getAttribute('n'));
    if (!pageMap.has(pageNumber)) {
      pageMap.set(pageNumber, {
        pageNumber: pageNumber,
        facsimile: pb.getAttribute('facs'),
        content: [],
      });
    }
  });

  // Assign each content element to its page
  contentElements.forEach(element => {
    const pageNumber = pageMapping.get(element.originalElement) || 1;

    if (pageMap.has(pageNumber)) {
      pageMap.get(pageNumber).content.push(element);
    }
  });

  // Convert to array and sort by page number
  const sortedPages = Array.from(pageMap.values()).sort(
    (a, b) => a.pageNumber - b.pageNumber,
  );

  return sortedPages;
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

    case 'doctitle': {
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
    }

    case 'docdate':
      // Don't return date separately, it will be handled by a special function
      return {
        type: 'date',
        content: element.textContent.trim(),
        skipRender: true,
      };

    case 'docedition':
      return {
        type: 'edition',
        content: element.textContent.trim(),
      };

    case 'head': {
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
    }

    case 'castlist': {
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
    }

    case 'set': {
      // Handle set elements (décors)
      const setParagraphs = getElementsByTagName(element, 'p');
      if (setParagraphs.length > 0) {
        return { type: 'stage', content: setParagraphs[0].textContent.trim() };
      }
      return { type: 'stage', content: element.textContent.trim() };
    }

    case 'stage': {
      // Only process standalone stage directions, not those nested in paragraphs
      if (element.parentNode.tagName.toLowerCase() === 'p') {
        return null; // Will be handled by the paragraph
      }
      const stageType = element.getAttribute('type');
      return {
        type: 'stage',
        content: element.textContent.trim(),
        stageType: stageType || 'general',
      };
    }

    case 'sp': {
      // Speech element - process speaker, paragraphs, verses AND stage directions together
      const speaker = getElementByTagName(element, 'speaker');
      const paragraphs = getElementsByTagName(element, 'p');
      const versesInSpeech = getElementsByTagName(element, 'lg');
      const speechResults = [];

      if (speaker) {
        speechResults.push({
          type: 'speaker',
          content: speaker.textContent.trim().toUpperCase(),
        });
      }

      // Process direct stage directions in speech (not nested in p or lg)
      const directStages = [];
      const allStagesInSp = getElementsByTagName(element, 'stage');
      for (const stage of allStagesInSp) {
        // Only process if stage is direct child of sp (not nested in p or lg)
        if (stage.parentNode === element) {
          const stageType = stage.getAttribute('type');
          directStages.push({
          type: 'stage',
          content: stage.textContent.trim(),
            stageType: stageType || 'general',
        });
      }
      }
      speechResults.push(...directStages);

      // Process each paragraph, handling nested stage directions
      for (const p of paragraphs) {
        const pContent = processParagramWithStage(p);
        if (pContent) {
          speechResults.push(...pContent);
        }
      }

      // Process each verse group (lg) within the speech
      for (const lg of versesInSpeech) {
        const lines = getElementsByTagName(lg, 'l');
        const verseLines = [];
        for (const line of lines) {
          verseLines.push(line.textContent.trim());
        }
        if (verseLines.length > 0) {
          speechResults.push({ type: 'verse', content: verseLines });
        }
        
        // Also check for stage directions within the lg
        const stagesInLg = getElementsByTagName(lg, 'stage');
        for (const stage of stagesInLg) {
          const stageType = stage.getAttribute('type');
          speechResults.push({
            type: 'stage',
            content: stage.textContent.trim(),
            stageType: stageType || 'general',
          });
        }
      }

      return speechResults;
    }

    case 'lg': {
      // Verse group
      const lines = getElementsByTagName(element, 'l');
      const verseLines = [];
      for (const line of lines) {
        verseLines.push(line.textContent.trim());
      }
      return verseLines.length > 0 ? { type: 'verse', content: verseLines } : null;
    }

    case 'p': {
      // Process standalone paragraphs
      const content = processParagramWithStage(element);
      return content && content.length > 0 ? content : null;
    }

    case 'listperson': {
      // List of characters in a scene
      const personGroups = getElementsByTagName(element, 'persongrp');
      const characters = [];
      for (const group of personGroups) {
        const names = getElementsByTagName(group, 'name');
        const stages = getElementsByTagName(group, 'stage');
        let characterList = '';
        for (const name of names) {
          characterList += name.textContent.trim() + ' ';
        }
        for (const stage of stages) {
          characterList += stage.textContent.trim() + ' ';
        }
        if (characterList) {
          characters.push(characterList.trim());
        }
      }
      return characters.length > 0 ? { type: 'sceneCharacters', content: characters } : null;
    }

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
        const stageType = node.getAttribute('type');
        result.push({
          type: 'stage',
          content: node.textContent.trim(),
          stageType: stageType || 'general',
        });
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
  // State management
  const [nakalaViewerUrl, setNakalaViewerUrl] = useState(null);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [imageUrls, setImageUrls] = useState([]); // Store Nakala image files for navigation

  // Separate state for transcription navigation
  const [currentTranscriptionPage, setCurrentTranscriptionPage] = useState(1);
  const [transcriptionPages, setTranscriptionPages] = useState([]);
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
          console.log('🔍 [DEBUG IIIF] Initializing viewer...');
          console.log('🔍 [DEBUG IIIF] Nakala identifier:', anthologyData.nakalaIdentifier);
          console.log('🔍 [DEBUG IIIF] File identifier:', anthologyData.nakalaFileIdentifier);

          // Get basic viewer URL
          const baseViewerUrl = getNakalaEmbedUrl(
            anthologyData.nakalaIdentifier,
            anthologyData.nakalaFileIdentifier,
            {
              buttons: true,
            },
          );

          setNakalaViewerUrl(baseViewerUrl);

          // Get all image files from Nakala data
          if (anthologyData.nakalaData && anthologyData.nakalaData.files) {
            // Filter and sort image files by name to get them in order
            const imageFiles = anthologyData.nakalaData.files
              .filter(file => file.mime_type && file.mime_type.startsWith('image/'))
              .sort((a, b) => a.name.localeCompare(b.name));

            console.log('🔍 [DEBUG IIIF] Image files found:', imageFiles.length);
            console.log('🔍 [DEBUG IIIF] Files:', imageFiles.map(f => f.name));

            if (imageFiles.length > 0) {
              setTotalPages(imageFiles.length);
              setImageUrls(imageFiles); // Store the files for navigation
              
              // Set initial viewer URL to first file
              const firstFile = imageFiles[0];
              const firstFileUrl = getNakalaEmbedUrl(
                anthologyData.nakalaIdentifier,
                firstFile.sha1,
                { buttons: true }
              );
              setNakalaViewerUrl(firstFileUrl);
            }
          } else {
            // Fallback to single file if no multiple files found
            setTotalPages(1);
            setNakalaViewerUrl(baseViewerUrl);
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
      imageUrls.length > 0 &&
      currentPage > 0
    ) {
      console.log('🔍 [DEBUG IIIF] Updating viewer for page:', currentPage);
      
      // Get the file for the current page (0-indexed)
      const currentFile = imageUrls[currentPage - 1];
      
      if (currentFile) {
        console.log('🔍 [DEBUG IIIF] Current file:', currentFile.name);
        console.log('🔍 [DEBUG IIIF] Current file SHA1:', currentFile.sha1);
        
        // Build URL for the specific file
        const pageUrl = getNakalaEmbedUrl(
        anthologyData.nakalaIdentifier,
          currentFile.sha1,
        {
          buttons: true,
        },
      );

        console.log('🔍 [DEBUG IIIF] Page URL:', pageUrl);
      setNakalaViewerUrl(pageUrl);
    }
    }
  }, [currentPage, anthologyData, imageUrls]);

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
        
        // Use the transcription file URL
        const response = await fetch(transcriptionFile.url);

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
      console.log('🔍 [DEBUG IIIF] Navigate to previous page:', currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      console.log('🔍 [DEBUG IIIF] Navigate to next page:', currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  // Transcription navigation handlers
  const handlePreviousTranscriptionPage = () => {
    if (currentTranscriptionPage > 1) {
      setCurrentTranscriptionPage(currentTranscriptionPage - 1);
    }
  };

  const handleNextTranscriptionPage = () => {
    if (currentTranscriptionPage < transcriptionPages.length) {
      setCurrentTranscriptionPage(currentTranscriptionPage + 1);
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
                    id="nakala-viewer-iframe"
                    src={nakalaViewerUrl}
                    title={`${t('anthology:digitalizedDocument')} - ${t('anthology:page')} ${currentPage}`}
                    className={styles.viewerFrame}
                    allowFullScreen
                    key={`viewer-${nakalaViewerUrl}`} // Force reload when URL changes
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
                
                {/* Transcription Navigation Controls */}
                {transcriptionPages.length > 1 && (
                  <div className={styles.transcriptionNavigation}>
                    <button
                      type="button"
                      className={styles.transcriptionNavButton}
                      onClick={handlePreviousTranscriptionPage}
                      disabled={currentTranscriptionPage <= 1}
                      title="Page précédente"
                    >
                      ‹ Préc
                    </button>

                    <span className={styles.transcriptionPageIndicator}>
                      Page {currentTranscriptionPage} / {transcriptionPages.length}
                    </span>

                    <button
                      type="button"
                      className={styles.transcriptionNavButton}
                      onClick={handleNextTranscriptionPage}
                      disabled={currentTranscriptionPage >= transcriptionPages.length}
                      title="Page suivante"
                    >
                      Suiv ›
                    </button>
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
                    const currentPageData = transcriptionPages.find(
                      page => page.pageNumber === currentTranscriptionPage,
                    );

                    if (currentPageData) {
                      return (
                        <div className={styles.transcriptionText}>
                          <div className={styles.transcriptionBody}>
                            {(() => {
                              const content = currentPageData.content;
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
                                } else if (item.type === 'sceneCharacters') {
                                  elements.push(
                                    <div key={i} className={styles.sceneCharacters}>
                                      {item.content.map((chars, idx) => (
                                        <p key={idx} className={styles.characterList}>
                                          {chars}
                                        </p>
                                      ))}
                                    </div>,
                                  );
                                } else if (item.type === 'speaker') {
                                  elements.push(
                                    <p key={i} className={styles.speaker}>
                                      {item.content}
                                    </p>,
                                  );
                                } else if (item.type === 'text') {
                                  // Check if this is a décors element
                                  const isDecorElement = item.content.match(/^(Prologue|Tableau [IVX]+)\s*:/);
                                  
                                  if (isDecorElement) {
                                    elements.push(
                                      <p key={i} className={styles.decor}>
                                        {item.content}
                                      </p>,
                                    );
                                  } else {
                                    elements.push(
                                      <p key={i} className={styles.text}>
                                        {item.content}
                                      </p>,
                                    );
                                  }
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
                    La transcription n&apos;est pas disponible pour cette œuvre
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
