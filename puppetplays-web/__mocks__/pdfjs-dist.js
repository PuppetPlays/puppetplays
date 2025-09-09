// Mock pour pdfjs-dist - évite les erreurs de canvas dans les environnements CI
// Utilisé par les composants PDF pour éviter les dépendances natives

module.exports = {
  getDocument: jest.fn(() => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: jest.fn((pageNum) => Promise.resolve({
        pageNumber: pageNum,
        getViewport: jest.fn((params) => ({
          width: params?.scale ? 100 * params.scale : 100,
          height: params?.scale ? 150 * params.scale : 150,
          scale: params?.scale || 1,
          rotation: params?.rotation || 0,
        })),
        render: jest.fn(() => ({
          promise: Promise.resolve(),
          cancel: jest.fn(),
        })),
        getTextContent: jest.fn(() => Promise.resolve({
          items: [],
          styles: {},
        })),
        getAnnotations: jest.fn(() => Promise.resolve([])),
      })),
      getDestinations: jest.fn(() => Promise.resolve({})),
      getOutline: jest.fn(() => Promise.resolve(null)),
      getMetadata: jest.fn(() => Promise.resolve({
        info: {},
        metadata: null,
      })),
      destroy: jest.fn(),
    }),
  })),
  GlobalWorkerOptions: {
    workerSrc: '',
  },
  version: '3.10.111',
  build: '3.10.111',
  PDFWorker: jest.fn(),
  PasswordResponses: {
    NEED_PASSWORD: 1,
    INCORRECT_PASSWORD: 2,
  },
  VerbosityLevel: {
    ERRORS: 0,
    WARNINGS: 1,
    INFOS: 5,
  },
};
