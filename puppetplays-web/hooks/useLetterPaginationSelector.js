import { useCallback, useState } from 'react';

const useLetterPaginationSelector = initialLetter => {
  const [currentLetter, setCurrentLetter] = useState(initialLetter);

  const handleScroll = useCallback(evt => {
    // Safety check for evt and evt.target
    if (!evt || !evt.target) return;
    
    const containerScrollTop = evt.target.scrollTop;
    
    // Safety check for querySelectorAll method
    if (!evt.target.querySelectorAll) return;
    
    try {
      const nodes = Array.from(
        evt.target.querySelectorAll('[data-paginate-letter]') || []
      );
      
      const currentNode = nodes.find(node => {
        return node && node.offsetTop >= containerScrollTop;
      });
      
      if (currentNode && currentNode.dataset && currentNode.dataset.paginateLetter) {
        setCurrentLetter(currentNode.dataset.paginateLetter);
      }
    } catch (error) {
      console.error('Error in handleScroll:', error);
    }
  }, []);

  return [currentLetter, handleScroll];
};

export default useLetterPaginationSelector;
