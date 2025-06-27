import { buildSearchQuery } from './api';

describe('buildSearchQuery', () => {
  describe('basic functionality', () => {
    test('empty string returns empty', () => {
      expect(buildSearchQuery('')).toBe('');
      expect(buildSearchQuery(null)).toBe('');
      expect(buildSearchQuery(undefined)).toBe('');
    });

    test('single word gets wildcard wrapping', () => {
      expect(buildSearchQuery('test')).toBe('*test*');
      expect(buildSearchQuery('longer')).toBe('*longer*');
    });

    test('quoted strings are preserved', () => {
      expect(buildSearchQuery('"exact phrase"')).toBe('"exact phrase"');
    });
  });

  describe('apostrophe handling', () => {
    test('single word with apostrophe creates alternatives', () => {
      const result = buildSearchQuery("l'empio");
      expect(result).toBe('"l\'empio" OR lempio*');
    });

    test('handles different apostrophe types', () => {
      expect(buildSearchQuery("l'empio")).toBe('"l\'empio" OR lempio*');
      expect(buildSearchQuery("l'empio")).toBe('"l\'empio" OR lempio*');
      expect(buildSearchQuery('l`empio')).toBe('"l\'empio" OR lempio*');
    });

    test('trailing space is handled', () => {
      expect(buildSearchQuery("l'empio ")).toBe('"l\'empio" OR lempio*');
    });
  });

  describe('multi-word searches', () => {
    test('two words: exact phrase + individual wildcards', () => {
      const result = buildSearchQuery('le monstre');
      expect(result).toBe('"le monstre" OR *le* OR *monstre*');
    });

    test('three words: exact phrase + individual wildcards', () => {
      const result = buildSearchQuery('The triumphs of');
      expect(result).toBe('"The triumphs of" OR *The* OR *triumphs* OR *of*');
    });

    test('words with apostrophes in multi-word search', () => {
      const result = buildSearchQuery("l'assemblée des");
      expect(result).toBe(
        '"l\'assemblée des" OR ("l\'assemblée" OR lassemblée*) OR *des*',
      );
    });
  });

  describe('specific problem cases', () => {
    test('The triumphs of love should match triumph', () => {
      const result = buildSearchQuery('The triumphs of love');
      expect(result).toContain('*triumphs*'); // This will match "triumph"
      expect(result).toContain('"The triumphs of love"'); // Exact phrase first
    });

    test("l'empio should handle apostrophe variations", () => {
      const result = buildSearchQuery("l'empio");
      expect(result).toContain('"l\'empio"'); // Exact match
      expect(result).toContain('lempio*'); // Without apostrophe
    });

    test("assemblée should match L'assemblée", () => {
      const result = buildSearchQuery('assemblée');
      expect(result).toBe('*assemblée*'); // Will match within "L'assemblée"
    });
  });

  describe('edge cases', () => {
    test('multiple spaces are normalized', () => {
      expect(buildSearchQuery('word1    word2')).toBe(
        '"word1 word2" OR *word1* OR *word2*',
      );
    });

    test('mixed quotes and apostrophes', () => {
      const result = buildSearchQuery('"l\'empio" test');
      expect(result).toContain('"l\'empio"');
      expect(result).toContain('*test*');
    });
  });
});
