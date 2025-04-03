import { useCallback, useState } from 'react';

const useLetterPaginationSelector = initialLetter => {
  const [currentLetter, setCurrentLetter] = useState(initialLetter);

  const handleScroll = useCallback(evt => {
    const containerScrollTop = evt.target.scrollTop;
    const currentNode = Array.from(
      evt.target.querySelectorAll('[data-paginate-letter]'),
    ).find(node => {
      return node.offsetTop >= containerScrollTop;
    });
    setCurrentLetter(currentNode.dataset.paginateLetter);
  }, []);

  return [currentLetter, handleScroll];
};

export default useLetterPaginationSelector;
