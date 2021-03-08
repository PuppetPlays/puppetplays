import { render } from '@testing-library/react';
import Work from './Work';

test('renders with only the rquired props', () => {
  render(<Work title="My work" />);
});
