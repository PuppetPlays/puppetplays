import { render, screen } from '@testing-library/react';
import FirstPerformance from './FirstPerformance';

const france = [{ title: 'France' }];

test('renders a section with a heading given a place, a date and an extraInfo', () => {
  render(
    <FirstPerformance place={france} date="1832" extraInfo="By Maurice Jo" />,
  );
  const h1 = screen.getByRole('heading', { level: 1 });
  expect(h1).toHaveTextContent('common:firstPerformance');
});

test('renders a section with a heading given only a place', () => {
  render(<FirstPerformance place={france} />);
  const h1 = screen.getByRole('heading', { level: 1 });
  expect(h1).toHaveTextContent('common:firstPerformance');
});

test('renders a section with a heading given only a date', () => {
  render(<FirstPerformance date="1832" />);
  const h1 = screen.getByRole('heading', { level: 1 });
  expect(h1).toHaveTextContent('common:firstPerformance');
});

test('renders nothing given no place, no date and no extraInfo', () => {
  const { container } = render(<FirstPerformance place={[]} />);
  expect(container).toBeEmptyDOMElement();
});

test('renders properly given a place, a date and an extraInfo', () => {
  const { container } = render(
    <FirstPerformance place={france} date="1832" extraInfo="By Maurice Jo" />,
  );
  expect(container).toHaveTextContent('France, 1832 - By Maurice Jo');
});

test('renders properly given only a place', () => {
  const { container } = render(<FirstPerformance place={france} />);
  expect(container).toHaveTextContent('France');
});

test('renders properly given only a date', () => {
  const { container } = render(<FirstPerformance date="1832" />);
  expect(container).toHaveTextContent('1832');
});

test('renders properly given only an extraInfo', () => {
  const { container } = render(<FirstPerformance extraInfo="By Maurice Jo" />);
  expect(container).toHaveTextContent('By Maurice Jo');
});

test('renders properly given a place and a date', () => {
  const { container } = render(<FirstPerformance place={france} date="1832" />);
  expect(container).toHaveTextContent('France, 1832');
});

test('renders properly given a place and an extraInfo', () => {
  const { container } = render(
    <FirstPerformance place={france} extraInfo="By Maurice Jo" />,
  );
  expect(container).toHaveTextContent('France, By Maurice Jo');
});

test('renders properly given a date and an extraInfo', () => {
  const { container } = render(
    <FirstPerformance date="1832" extraInfo="By Maurice Jo" />,
  );
  expect(container).toHaveTextContent('1832 - By Maurice Jo');
});
