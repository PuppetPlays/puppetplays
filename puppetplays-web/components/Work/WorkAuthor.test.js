import { render } from '@testing-library/react';
import WorkAuthor from './WorkAuthor';

test('renders an author with a common name', () => {
  const { container } = render(
    <WorkAuthor commonName="Fish" firstName="Raymond" lastName="Poisson" />,
  );
  expect(container).toHaveTextContent('Fish (Raymond Poisson)');
});

test('renders an author without a common name', () => {
  const { container } = render(
    <WorkAuthor firstName="Raymond" lastName="Poisson" />,
  );
  expect(container).toHaveTextContent('Raymond Poisson');
});

test('renders an author with a common name and a nickname', () => {
  const { container } = render(
    <WorkAuthor
      commonName="Fish"
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
    <WorkAuthor firstName="Raymond" lastName="Poisson" nickname="Ray" />,
  );
  expect(container).toHaveTextContent('Raymond Poisson (common:alias Ray)');
});

test('renders an author with only a nickname and a common name', () => {
  const { container } = render(
    <WorkAuthor commonName="Fishy" nickname="Ray" />,
  );
  expect(container).toHaveTextContent('Fishy (common:alias Ray)');
});

test('renders an author with only a common name', () => {
  const { container } = render(<WorkAuthor commonName="Fishy" />);
  expect(container).toHaveTextContent('Fishy');
});

test('renders an author with only a first name', () => {
  const { container } = render(<WorkAuthor firstName="Raymond" />);
  expect(container).toHaveTextContent('Raymond');
});
