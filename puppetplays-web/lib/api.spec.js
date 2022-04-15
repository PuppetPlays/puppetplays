import { buildSearchQuery } from './api';

describe('buildSearchQuery', () => {
  const testCases = [
    ['mot1 mot2 mot3', 'mot1 OR mot2 OR mot3'],
    ['"mot1 mot2" mot3', '"mot1 mot2" OR mot3'],
    ['"mot1 mot2 mot3"', '"mot1 mot2 mot3"'],
    ['mot1+mot2 mot3', 'mot1 mot2 OR mot3'],
    ['mot1+mot2+mot3', 'mot1 mot2 mot3'],
    ['mot1+"mot2 mot3"', 'mot1 "mot2 mot3"'],
    ['mot1 + "mot2 mot3"', 'mot1 "mot2 mot3"'],
    ['mot1+ "mot2 mot3"', 'mot1 "mot2 mot3"'],
    ['mot1 +"mot2 mot3"', 'mot1 "mot2 mot3"'],
  ];

  testCases.forEach(([given, expected]) => {
    test(`given ${given} it should return ${expected}`, () => {
      const searchQuery = buildSearchQuery(given);

      expect(searchQuery).toBe(expected);
    });
  });
});
