import { render, screen } from '@testing-library/react';
import Info from './Info';

test('renders the work info', () => {
  render(<Info label="Info label">Work info content</Info>);

  expect(screen.getByText('Info label')).toBeInTheDocument();
  expect(screen.getByText('Work info content')).toBeInTheDocument();
});

test('renders neither the label nor the content given show prop false', () => {
  render(
    <Info label="Info label" show={false}>
      Work info content
    </Info>,
  );

  expect(screen.queryByText('Info label')).not.toBeInTheDocument();
  expect(screen.queryByText('Work info content')).not.toBeInTheDocument();
});
