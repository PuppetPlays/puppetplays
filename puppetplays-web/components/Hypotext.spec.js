import { render } from '@testing-library/react';
import Hypotext from './Hypotext';

test('renders an hypotext with only a title', () => {
  const { container } = render(<Hypotext title="Liliade" />);
  expect(container).toHaveTextContent('Liliade');
});

test('renders an hypotext with a title and a date', () => {
  const { container } = render(<Hypotext title="Liliade" date="-3000" />);
  expect(container).toHaveTextContent('Liliade, -3000');
});

test('renders an hypotext with a title, a date and an author', () => {
  const author = { firstName: 'Homére', typeHandle: 'persons' };
  const { container } = render(
    <Hypotext title="Liliade" date="-3000" authors={[author]} />,
  );
  expect(container).toHaveTextContent('Liliade, Homére, -3000');
});
