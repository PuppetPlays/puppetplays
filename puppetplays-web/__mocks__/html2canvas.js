// Mock pour html2canvas - évite les erreurs dans les environnements CI
// Utilisé pour la génération d'images à partir d'éléments DOM

module.exports = jest.fn((element, options) => {
  return Promise.resolve({
    width: options?.width || 300,
    height: options?.height || 150,
    toDataURL: jest.fn((type, quality) => {
      const mimeType = type || 'image/png';
      return `data:${mimeType};base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
    }),
    toBlob: jest.fn((callback, type, quality) => {
      const blob = new Blob([''], { type: type || 'image/png' });
      if (callback) callback(blob);
      return Promise.resolve(blob);
    }),
    getContext: jest.fn(() => ({
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      fillText: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      measureText: jest.fn(() => ({ width: 10 })),
      transform: jest.fn(),
      rect: jest.fn(),
      clip: jest.fn(),
    })),
  });
});

// Export par défaut pour la compatibilité ES6
module.exports.default = module.exports;
