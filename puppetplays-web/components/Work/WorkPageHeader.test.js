import { render, screen } from '@testing-library/react';
import WorkPageHeader from './WorkPageHeader';

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

test('renders the work page header', () => {
  render(
    <WorkPageHeader
      title="My work"
      authors={authors}
      compositionPlace={place}
    />,
  );

  const backButton = screen.getByRole('button');
  const content = screen.getByTestId('work-page-header-content');

  expect(backButton).toBeInTheDocument();
  expect(content).toHaveTextContent(
    'My work-Raymond Poisson, Claude Garbut-Paris, France',
  );
});

test('renders the work page header without a writing place', () => {
  render(<WorkPageHeader title="My work" authors={authors} />);

  const backButton = screen.getByRole('button');
  const content = screen.getByTestId('work-page-header-content');

  expect(backButton).toBeInTheDocument();
  expect(content).toHaveTextContent('My work-Raymond Poisson, Claude Garbut');
});
