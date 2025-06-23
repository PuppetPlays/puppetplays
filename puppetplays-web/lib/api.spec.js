import { buildSearchQuery } from './api';

describe('buildSearchQuery', () => {
  describe('basic functionality', () => {
    test('empty string returns empty', () => {
      expect(buildSearchQuery('')).toBe('');
      expect(buildSearchQuery(null)).toBe('');
      expect(buildSearchQuery(undefined)).toBe('');
    });

    test('single word with wildcard', () => {
      expect(buildSearchQuery('mot1')).toBe('"mot1" OR mot1*'); // short term (4 chars)
      expect(buildSearchQuery('test')).toBe('"test" OR test*'); // short term
      expect(buildSearchQuery('longer')).toBe('longer*'); // longer term
    });

    test('quoted strings are preserved', () => {
      expect(buildSearchQuery('"mot1 mot2 mot3"')).toBe('"mot1 mot2 mot3"');
      expect(buildSearchQuery('"mot1 mot2" mot3')).toBe('"mot1 mot2" mot3');
    });
  });

  describe('apostrophe handling', () => {
    test('preserves apostrophes and searches variants', () => {
      const result = buildSearchQuery("l'assemblée");
      // Single term with apostrophe - should be preserved as-is
      expect(result).toBe("l'assemblée");
    });

    test('normalizes different apostrophe types', () => {
      const result1 = buildSearchQuery("l'assemblée");
      const result2 = buildSearchQuery("l'assemblée");
      expect(result1).toBe(result2);
    });

    test('apostrophe in multi-word search', () => {
      const result = buildSearchQuery("l'assemblée des poissardes", 'fr');
      // Should contain the apostrophe term
      expect(result).toContain("l'assemblée");
      expect(result).toContain('poissardes');
      // The function will filter "des" as a stop word in French
    });
  });

  describe('multi-word searches', () => {
    test('two words: multiple strategies', () => {
      const result = buildSearchQuery('mot1 mot2');
      expect(result).toContain('"mot1 mot2"'); // exact phrase
      expect(result).toContain('(mot1 AND mot2)'); // both required
      expect(result).toContain('mot1 OR mot2'); // fallback
    });

    test('three words: comprehensive strategies', () => {
      const result = buildSearchQuery('mot1 mot2 mot3');
      expect(result).toContain('"mot1 mot2 mot3"'); // exact phrase
      expect(result).toContain('(mot1 AND mot2 AND mot3)'); // all required
      expect(result).toContain('mot1 OR mot2 OR mot3'); // fallback
    });
  });

  describe('special character handling', () => {
    test('handles + as space', () => {
      const result1 = buildSearchQuery('mot1+mot2 mot3');
      const result2 = buildSearchQuery('mot1 mot2 mot3');
      expect(result1).toBe(result2);
    });

    test('mixed quotes and regular terms', () => {
      const result = buildSearchQuery('mot1 "mot2 mot3"');
      expect(result).toContain('mot1');
      expect(result).toContain('"mot2 mot3"');
    });
  });

  describe('stop words filtering', () => {
    test('preserves stop words in short searches', () => {
      const result = buildSearchQuery('le monstre', 'fr');
      expect(result).toContain('le');
      expect(result).toContain('monstre');
    });

    test('preserves contractions with apostrophes', () => {
      const result = buildSearchQuery("l'empio", 'fr');
      expect(result).toContain("l'empio");
    });
  });
});
