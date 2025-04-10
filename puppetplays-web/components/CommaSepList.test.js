import { render } from '@testing-library/react';
import CommaSepList from './CommaSepList';
import Author from './Author';

// Mock pour next-i18next
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: key => {
      const translations = {
        'common:note': 'Note',
        'common:contentNotAvailable': 'Contenu non disponible',
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

test('renders a list with on string', () => {
  const list = ['keyword'];
  const { container } = render(<CommaSepList list={list} />);
  expect(container).toHaveTextContent('keyword');
});

test('renders a list of strings', () => {
  const list = ['keyword', 'tag', 'thing'];
  const { container } = render(<CommaSepList list={list} />);
  expect(container).toHaveTextContent('keyword, tag, thing');
});

test('renders a list of strings with a custom separator', () => {
  const list = ['keyword', 'tag', 'thing'];
  const { container } = render(<CommaSepList list={list} separator=" / " />);
  expect(container).toHaveTextContent('keyword / tag / thing');
});

test('renders a list of strings given a list of objects and a tranform function', () => {
  const list = [{ title: 'keyword' }, { title: 'tag' }, { title: 'thing' }];
  const { container } = render(
    <CommaSepList list={list} listTransform={({ title }) => title} />,
  );
  expect(container).toHaveTextContent('keyword, tag, thing');
});

test('renders a list of Components', () => {
  const authors = [
    { id: '1', firstName: 'Homére' },
    { id: '2', firstName: 'Raymond', lastName: 'Poisson' },
  ];
  const { container } = render(
    <CommaSepList list={authors} itemComponent={Author} />,
  );
  expect(container).toHaveTextContent('Homére');
});

test('renders a list of one author', () => {
  const authors = [{ id: '1', firstName: 'Homére', typeHandle: 'persons' }];
  const { container } = render(
    <CommaSepList list={authors} itemComponents={{ persons: Author }} />,
  );
  expect(container).toHaveTextContent('Homére');
});
