import { render, screen } from '@testing-library/react';
import WorkHeader from './WorkHeader';

const authors = [
  { firstName: 'Raymond', lastName: 'Poisson', typeHandle: 'persons' },
  { firstName: 'Claude', lastName: 'Garbut', typeHandle: 'persons' },
];

const place = [
  {
    title: 'Paris',
    country: [{ title: 'France' }],
  },
];

const mainLanguage = [{ title: 'French' }];

test('renders the work header', () => {
  render(
    <WorkHeader
      title="My work"
      subtitle="Is this a work?"
      authors={authors}
      referenceDate="1926"
      writingPlace={place}
      mainLanguage={mainLanguage}
    />,
  );

  const h1 = screen.getByRole('heading', { level: 1 });
  const h2 = screen.getByRole('heading', { level: 2 });
  const h3 = screen.getByRole('heading', { level: 3 });

  expect(h1).toHaveTextContent('My work');
  expect(h2).toHaveTextContent('Is this a work?');
  expect(h3).toHaveTextContent(
    'Raymond Poisson, Claude Garbut|1926|Paris, France|French',
  );
});

test('renders the work header without a subtitle', () => {
  render(<WorkHeader title="My work" />);

  const h2 = screen.queryByRole('heading', { level: 2 });

  expect(h2).not.toBeInTheDocument();
});

test('renders the work header without a date', () => {
  render(
    <WorkHeader
      title="My work"
      subtitle="Is this a work?"
      authors={authors}
      writingPlace={place}
      mainLanguage={mainLanguage}
    />,
  );

  const h3 = screen.getByRole('heading', { level: 3 });

  expect(h3).toHaveTextContent(
    'Raymond Poisson, Claude Garbut|Paris, France|French',
  );
});

test('renders the work header without a place', () => {
  render(
    <WorkHeader
      title="My work"
      subtitle="Is this a work?"
      authors={authors}
      referenceDate="1926"
      mainLanguage={mainLanguage}
    />,
  );

  const h3 = screen.getByRole('heading', { level: 3 });

  expect(h3).toHaveTextContent('Raymond Poisson, Claude Garbut|1926|French');
});

test('renders the work header without a language', () => {
  render(
    <WorkHeader
      title="My work"
      subtitle="Is this a work?"
      authors={authors}
      referenceDate="1926"
      writingPlace={place}
    />,
  );

  const h3 = screen.getByRole('heading', { level: 3 });

  expect(h3).toHaveTextContent(
    'Raymond Poisson, Claude Garbut|1926|Paris, France',
  );
});

test('renders the work header without a language and a date', () => {
  render(
    <WorkHeader
      title="My work"
      subtitle="Is this a work?"
      authors={authors}
      writingPlace={place}
    />,
  );

  const h3 = screen.getByRole('heading', { level: 3 });

  expect(h3).toHaveTextContent('Raymond Poisson, Claude Garbut|Paris, France');
});
