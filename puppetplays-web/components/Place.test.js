import { render } from '@testing-library/react';

import Place from './Place';

const france = [{ title: 'France' }];

test('renders a place', () => {
  const { container } = render(<Place title="Paris" country={france} />);

  expect(container).toHaveTextContent('Paris, France');
});

test('renders a place without country', () => {
  const { container } = render(<Place title="Paris" />);

  expect(container).toHaveTextContent('Paris');
});

test('renders a place with a country as title', () => {
  const { container } = render(<Place title="France" country={france} />);

  expect(container).toHaveTextContent('France');
});
