import { render, screen, fireEvent } from '@testing-library/react';
import WorkSummary from './WorkSummary';

jest.mock('@tippyjs/react', () => ({
  __esModule: true,
  default: jest.fn(),
}));

test('renders with only the rquired props', () => {
  render(<WorkSummary id="1" title="My work" slug="my-work" />);

  const h1 = screen.getByRole('heading', { level: 1 });

  expect(h1).toHaveTextContent('My work');
});

test('renders the expanded version with only the rquired props', () => {
  const { getByRole } = render(
    <WorkSummary id="1" title="My work" slug="my-work" />,
  );

  fireEvent.click(getByRole('button'));

  const h1 = screen.getByRole('heading', { level: 1 });

  expect(h1).toHaveTextContent('My work');
});
