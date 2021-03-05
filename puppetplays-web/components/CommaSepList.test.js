import { render } from '@testing-library/react';
import CommaSepList from './CommaSepList';
import WorkAuthor from './Work/WorkAuthor';

test('renders a list of one author', () => {
  const author = { firstName: 'Homére', typeHandle: 'persons' };
  const { container } = render(
    <CommaSepList list={[author]} itemComponents={{ persons: WorkAuthor }} />,
  );
  expect(container).toHaveTextContent('Homére');
});
