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
      const result = buildSearchQuery("l'empio");
      expect(result).toBe("l'empio* OR lempio*");
    });

    test('handles different apostrophe types', () => {
      expect(buildSearchQuery("l'empio")).toBe("l'empio* OR lempio*");
      expect(buildSearchQuery("l'empio")).toBe("l'empio* OR lempio*");
      expect(buildSearchQuery("l`empio")).toBe("l'empio* OR lempio*");
    });

    test('trailing space is handled', () => {
      expect(buildSearchQuery("l'empio ")).toBe("l'empio* OR lempio*");
    });
  });

  describe('truly progressive multi-word searches', () => {
    test('two words: exact phrase + implicit AND only', () => {
      const result = buildSearchQuery('le monstre');
      // TRULY progressive: no individual word OR
      expect(result).toBe('"le monstre" OR le* monstre*');
    });

    test('two significant words: exact phrase + implicit AND only', () => {
      const result = buildSearchQuery('monstre alchimiste');
      // TRULY progressive: no individual word OR (monstre* OR alchimiste*)
      expect(result).toBe('"monstre alchimiste" OR monstre* alchimiste*');
    });

    test('three words: exact phrase + implicit AND only', () => {
      const result = buildSearchQuery('la comica del');
      // TRULY progressive: no individual word OR
      expect(result).toBe('"la comica del" OR la* comica* del*');
    });

    test('four words: exact phrase + implicit AND only', () => {
      const result = buildSearchQuery('la comica del cielo');
      // TRULY progressive: more words = more precise
      expect(result).toBe('"la comica del cielo" OR la* comica* del* cielo*');
    });

    test('three words with apostrophes: progressive approach', () => {
      const result = buildSearchQuery("l'assemblée des poissardes");
      // IMPROVED: now includes apostrophe handling strategies for better matching
      expect(result).toBe('"l\'assemblée des poissardes" OR l\'assemblée des* poissardes* OR lassemblée* des* poissardes* OR "lassemblée des poissardes"');
    });
  });

  describe('truly progressive prevents result explosion', () => {
    test('two words with common word: uses implicit AND only', () => {
      const result = buildSearchQuery('le regal');
      // TRULY progressive: no individual OR with common words
      expect(result).toBe('"le regal" OR le* regal*');
    });

    test('two English words: uses implicit AND only', () => {
      const result = buildSearchQuery('the triumph');
      // TRULY progressive: no individual OR
      expect(result).toBe('"the triumph" OR the* triumph*');
    });

    test('two significant words: still uses implicit AND only', () => {
      const result = buildSearchQuery('triumph victory');
      // TRULY progressive: no individual OR even for significant words
      expect(result).toBe('"triumph victory" OR triumph* victory*');
    });
  });

  describe('specific problem cases - truly progressive solutions', () => {
    test('la comica del: NO individual word OR queries', () => {
      const result = buildSearchQuery('la comica del');
      // Should use truly progressive approach: exact phrase + implicit AND
      expect(result).toBe('"la comica del" OR la* comica* del*');
      // Should NOT contain individual word OR clauses
      expect(result).not.toContain('la* OR');
      expect(result).not.toContain('comica* OR');
      expect(result).not.toContain('del* OR');
    });

    test('monstre alchimiste: NO individual word OR queries', () => {
      const result = buildSearchQuery('monstre alchimiste');
      // TRULY progressive: exact phrase + implicit AND only
      expect(result).toBe('"monstre alchimiste" OR monstre* alchimiste*');
      // Should NOT contain individual word OR clauses
      expect(result).not.toContain('monstre* OR');
      expect(result).not.toContain('alchimiste* OR');
    });

    test('le regal des dames: truly progressive approach', () => {
      const result = buildSearchQuery('le regal des dames');
      // TRULY progressive: 4 words = exact phrase + implicit AND only
      expect(result).toBe('"le regal des dames" OR le* regal* des* dames*');
    });

    test("l'empio should handle apostrophe variations", () => {
      const result = buildSearchQuery("l'empio");
      expect(result).toContain("l'empio*");
      expect(result).toContain('lempio*');
      expect(result).toBe("l'empio* OR lempio*");
    });

    test('assemblée should match L\'assemblée', () => {
      const result = buildSearchQuery('assemblée');
      expect(result).toBe('assemblée*');
    });

    test('venus adonis triumph love: truly progressive approach', () => {
      const result = buildSearchQuery('venus adonis triumph love');
      // TRULY progressive: 4+ words = exact phrase + implicit AND only
      expect(result).toBe('"venus adonis triumph love" OR venus* adonis* triumph* love*');
    });
  });

  describe('edge cases', () => {
    test('multiple spaces are normalized', () => {
      // TRULY progressive: no individual word OR
      expect(buildSearchQuery('word1    word2')).toBe('"word1 word2" OR word1* word2*');
    });

    test('single quoted phrase with apostrophe', () => {
      const result = buildSearchQuery('"l\'empio test"');
      expect(result).toBe('"l\'empio test"');
    });

    test('truly progressive approach for long phrases', () => {
      const result = buildSearchQuery('a very long search phrase with many words');
      // TRULY progressive: exact phrase + implicit AND only
      expect(result).toBe(
        '"a very long search phrase with many words" OR a* very* long* search* phrase* with* many* words*'
      );
    });
  });
});
