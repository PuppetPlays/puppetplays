import { render } from '@testing-library/react';
import Work from './Work';

jest.mock('@tippyjs/react', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter() {
    return {
      locale: 'fr',
    };
  },
}));

test('renders with only the required props', () => {
  render(<Work title="My work" />);
});
