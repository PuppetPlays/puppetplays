import { useCallback, useState } from 'react';

const useActiveAnchor = (anchorSelector, initialActiveAnchor) => {
  const [currentAnchor, setCurrentAnchor] = useState(initialActiveAnchor);

  const handleScroll = useCallback(
    (evt) => {
      const containerScrollTop = evt.target.scrollTop;
      const currentNode = Array.from(
        evt.target.querySelectorAll(anchorSelector),
      ).find((node) => {
        return node.offsetTop >= containerScrollTop;
      });
      if (currentNode) {
        setCurrentAnchor(currentNode.id);
      }
    },
    [anchorSelector],
  );

  return [currentAnchor, handleScroll];
};

export default useActiveAnchor;
