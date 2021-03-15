import { render } from '@testing-library/react';
import Author from './Author';

test('renders an author with a common name', () => {
  const { container } = render(
    <Author usualName="Fish" firstName="Raymond" lastName="Poisson" />,
  );
  expect(container).toHaveTextContent('Fish (Raymond Poisson)');
});

test('renders an author without a common name', () => {
  const { container } = render(
    <Author firstName="Raymond" lastName="Poisson" />,
  );
  expect(container).toHaveTextContent('Raymond Poisson');
});

test('renders an author with a common name and a nickname', () => {
  const { container } = render(
    <Author
      usualName="Fish"
      firstName="Raymond"
      lastName="Poisson"
      nickname="Ray"
    />,
  );
  expect(container).toHaveTextContent(
    'Fish (Raymond Poisson, common:alias Ray)',
  );
});

test('renders an author with a nickname but without a common name', () => {
  const { container } = render(
    <Author firstName="Raymond" lastName="Poisson" nickname="Ray" />,
  );
  expect(container).toHaveTextContent('Raymond Poisson (common:alias Ray)');
});

test('renders an author with only a nickname and a common name', () => {
  const { container } = render(<Author usualName="Fishy" nickname="Ray" />);
  expect(container).toHaveTextContent('Fishy (common:alias Ray)');
});

test('renders an author with only a common name', () => {
  const { container } = render(<Author usualName="Fishy" />);
  expect(container).toHaveTextContent('Fishy');
});

test('renders an author with only a first name', () => {
  const { container } = render(<Author firstName="Raymond" />);
  expect(container).toHaveTextContent('Raymond');
});
