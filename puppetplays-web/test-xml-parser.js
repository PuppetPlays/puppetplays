const fs = require('fs');
const { DOMParser } = require('xmldom');

// Load the XML file
const xmlContent = fs.readFileSync('./example.xml', 'utf8');

// Helper function to get elements by tag name (replacement for querySelectorAll)
function getElementsByTagName(element, tagName) {
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
}

// Helper function to get first element by tag name (replacement for querySelector)
function getElementByTagName(element, tagName) {
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
}

// Parse XML and extract content with proper styling
function parseXMLTranscription(xmlContent) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  
  // Find all page breaks using simple traversal
  const pageBreaks = getElementsByTagName(xmlDoc, 'pb');
  console.log(`Found ${pageBreaks.length} page breaks`);
  
  // Process content by page
  const pages = [];
  
  for (let i = 0; i < pageBreaks.length; i++) {
    const currentPb = pageBreaks[i];
    const nextPb = pageBreaks[i + 1];
    const pageNumber = currentPb.getAttribute('n');
    
    console.log(`\n=== Processing Page ${pageNumber} ===`);
    
    const pageContent = extractPageContent(xmlDoc, currentPb, nextPb);
    
    pages.push({
      pageNumber: parseInt(pageNumber),
      content: pageContent
    });
    
    console.log(`Page ${pageNumber} has ${pageContent.length} content items`);
  }
  
  return pages;
}

// Extract content for a single page, preserving hierarchy
function extractPageContent(xmlDoc, currentPb, nextPb) {
  const content = [];
  
  // Simplified approach: collect elements that come after currentPb and before nextPb
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
}

// Process a single element and return styled content
function processElement(element) {
  const tagName = element.tagName.toLowerCase();
  
  // Skip if this element is contained within another element we'll process
  if (isNestedInProcessableElement(element)) {
    return null;
  }
  
  switch (tagName) {
    case 'docauthor':
      return { type: 'author', content: `Auteur : ${element.textContent.trim()}` };
    
    case 'doctitle':
      const titleParts = getElementsByTagName(element, 'titlepart');
      const titleResults = [];
      for (let part of titleParts) {
        const type = part.getAttribute('type');
        if (type === 'main') {
          titleResults.push({ type: 'title', content: part.textContent.trim() });
        } else if (type === 'sub') {
          titleResults.push({ type: 'subtitle', content: part.textContent.trim() });
        }
      }
      return titleResults.length > 0 ? titleResults : null;
    
    case 'docdate':
      return { type: 'date', content: element.textContent.trim() };
    
    case 'head':
      const headType = element.getAttribute('type');
      if (headType === 'tableau') {
        return { type: 'heading', content: element.textContent.trim() };
      } else if (headType === 'scene') {
        return { type: 'sceneHeading', content: element.textContent.trim() };
      } else if (headType === 'personnage') {
        return { type: 'heading', content: element.textContent.trim() };
      }
      return { type: 'heading', content: element.textContent.trim() };
    
    case 'castlist':
      const roles = [];
      const castItems = getElementsByTagName(element, 'castitem');
      for (let item of castItems) {
        const role = getElementByTagName(item, 'role');
        const roleDesc = getElementByTagName(item, 'roledesc');
        if (role) {
          roles.push({
            role: role.textContent.trim(),
            roleDesc: roleDesc ? roleDesc.textContent.trim() : ''
          });
        }
      }
      return roles.length > 0 ? { type: 'castList', content: roles } : null;
    
    case 'set':
      return { type: 'stage', content: `Décors : ${element.textContent.trim()}` };
    
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
        speechResults.push({ type: 'speaker', content: speaker.textContent.trim().toUpperCase() });
      }
      
      // Process each paragraph, handling nested stage directions
      for (let p of paragraphs) {
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
      for (let line of lines) {
        verses.push(line.textContent.trim());
      }
      return verses.length > 0 ? { type: 'verse', content: verses } : null;
    
    default:
      return null;
  }
}

// Process a paragraph that might contain nested stage directions
function processParagramWithStage(paragraph) {
  const result = [];
  const childNodes = Array.from(paragraph.childNodes);
  
  let currentText = '';
  
  for (let node of childNodes) {
    if (node.nodeType === 3) { // Text node
      currentText += node.textContent;
    } else if (node.nodeType === 1) { // Element node
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
}

// Check if element is nested in another processable element
function isNestedInProcessableElement(element) {
  const processableTags = ['sp', 'castlist', 'doctitle', 'lg'];
  let parent = element.parentNode;
  
  while (parent && parent.tagName) {
    if (processableTags.includes(parent.tagName.toLowerCase())) {
      return true;
    }
    parent = parent.parentNode;
  }
  
  return false;
}

// Test the parsing
console.log('Testing XML parsing...\n');

try {
  const pages = parseXMLTranscription(xmlContent);
  
  // Show first few pages in detail
  for (let i = 0; i < Math.min(3, pages.length); i++) {
    const page = pages[i];
    console.log(`\n📄 PAGE ${page.pageNumber}:`);
    console.log('=' .repeat(50));
    
    page.content.forEach((item, index) => {
      console.log(`${index + 1}. [${item.type.toUpperCase()}] ${
        item.type === 'castList' 
          ? `${item.content.length} roles` 
          : item.content
      }`);
    });
  }
  
  console.log(`\n✅ Successfully parsed ${pages.length} pages`);
  
} catch (error) {
  console.error('❌ Error parsing XML:', error);
} } 
} } 

