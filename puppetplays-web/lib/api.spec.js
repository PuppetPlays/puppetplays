import { buildSearchQuery } from './api';

describe('buildSearchQuery', () => {
  describe('basic functionality', () => {
    test('empty string returns empty', () => {
      expect(buildSearchQuery('')).toBe('');
      expect(buildSearchQuery(null)).toBe('');
      expect(buildSearchQuery(undefined)).toBe('');
    });

    test('single word gets wildcard suffix', () => {
      expect(buildSearchQuery('test')).toBe('test*');
      expect(buildSearchQuery('longer')).toBe('longer*');
    });

    test('quoted strings are preserved', () => {
      expect(buildSearchQuery('"exact phrase"')).toBe('"exact phrase"');
    });
  });

  describe('apostrophe handling', () => {
    test('single word with apostrophe creates alternatives', () => {
      const result = buildSearchQuery('l\'empio');
      expect(result).toBe('l\'empio* OR lempio*');
    });

    test('handles different apostrophe types', () => {
      expect(buildSearchQuery('l\'empio')).toBe('l\'empio* OR lempio*');
      expect(buildSearchQuery('l\'empio')).toBe('l\'empio* OR lempio*');
      expect(buildSearchQuery('l`empio')).toBe('l\'empio* OR lempio*');
    });

    test('trailing space is handled', () => {
      expect(buildSearchQuery('l\'empio ')).toBe('l\'empio* OR lempio*');
    });
  });

  describe('conservative multi-word searches', () => {
    test('two words with one common: exact phrase + significant word only', () => {
      const result = buildSearchQuery('le monstre');
      // Conservative: "le" is common, so only exact phrase + significant word
      expect(result).toBe('"le monstre" OR monstre*');
    });

    test('two non-common words: includes multiple strategies', () => {
      const result = buildSearchQuery('monstre alchimiste');
      expect(result).toBe('"monstre alchimiste" OR monstre* alchimiste* OR monstre* OR alchimiste*');
    });

    test('four or more words: very conservative approach', () => {
      const result = buildSearchQuery('The triumphs of love');
      // Conservative: 4+ words = exact phrase + first significant word only
      expect(result).toBe('"The triumphs of love" OR triumphs*');
    });

    test('three words with apostrophes: limited strategies', () => {
      const result = buildSearchQuery('l\'assemblée des poissardes');
      // 3 words: exact phrase + significant words strategies
      expect(result).toBe('"l\'assemblée des poissardes" OR l\'assemblée* poissardes* OR l\'assemblée* OR poissardes*');
    });
  });

  describe('common words filtering prevents result explosion', () => {
    test('avoids OR with common French words', () => {
      const result = buildSearchQuery('le regal');
      // Conservative: "le" is common, focus on significant word
      expect(result).toBe('"le regal" OR regal*');
    });

    test('avoids OR with common English words', () => {
      const result = buildSearchQuery('the triumph');
      // Conservative: "the" is common, focus on significant word
      expect(result).toBe('"the triumph" OR triumph*');
    });

    test('allows multiple strategies with non-common words', () => {
      const result = buildSearchQuery('triumph victory');
      expect(result).toBe('"triumph victory" OR triumph* victory* OR triumph* OR victory*');
    });
  });

  describe('specific problem cases from user feedback', () => {
    test('le regal des dames: CRITICAL - should NOT return 373 results', () => {
      const result = buildSearchQuery('le regal des dames');
      // Should NOT contain problematic OR with common words
      expect(result).not.toContain('OR le*');
      expect(result).not.toContain('OR des*');
      expect(result).not.toContain('OR dames*');
      // Should be conservative: exact phrase + first significant word
      expect(result).toBe('"le regal des dames" OR regal*');
    });

    test('l\'empio should handle apostrophe variations', () => {
      const result = buildSearchQuery('l\'empio');
      expect(result).toContain('l\'empio*');
      expect(result).toContain('lempio*');
      expect(result).toBe('l\'empio* OR lempio*');
    });

    test('assemblée should match L\'assemblée', () => {
      const result = buildSearchQuery('assemblée');
      expect(result).toBe('assemblée*');
    });

    test('venus adonis triumph love: 4+ words = very conservative', () => {
      const result = buildSearchQuery('venus adonis triumph love');
      // Conservative: exact phrase + first significant word only
      expect(result).toBe('"venus adonis triumph love" OR venus*');
    });
  });

  describe('edge cases', () => {
    test('multiple spaces are normalized', () => {
      // Two words: both significant, so full strategies
      expect(buildSearchQuery('word1    word2')).toBe('"word1 word2" OR word1* word2* OR word1* OR word2*');
    });

    test('single quoted phrase with apostrophe', () => {
      const result = buildSearchQuery('"l\'empio test"');
      expect(result).toBe('"l\'empio test"');
    });

    test('conservative approach for long phrases', () => {
      const result = buildSearchQuery('a very long search phrase with many words');
      // 8 words = very conservative, takes first significant word which is "a"
      expect(result).toBe('"a very long search phrase with many words" OR a*');
    });
  });
});
