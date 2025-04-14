import { render, screen } from '@testing-library/react';

import Section from './Section';

test('renders the work section', () => {
  render(<Section title="Section label">Work section content</Section>);

  const h1 = screen.getByRole('heading', { level: 1 });

  expect(h1).toHaveTextContent('Section label');

  expect(screen.getByText('Work section content')).toBeInTheDocument();
});

test('renders neither the label nor the content given show prop false', () => {
  render(
    <Section title="Section label" show={false}>
      Work section content
    </Section>,
  );

  expect(screen.queryByText('Info label')).not.toBeInTheDocument();
  expect(screen.queryByText('Work info content')).not.toBeInTheDocument();
});
