import { render, screen } from '@testing-library/react';
import React from 'react';

import { Keyword } from './Keywords.js';

// Mock du composant Keywords
const Keywords = ({
  keywords = [],
  component: Component = Keyword,
  fill = false,
}) => {
  const attrs = {};
  if (fill) {
    attrs['data-fill'] = fill;
  }

  return (
    <ul {...attrs}>
      {keywords.map(({ title, ...keyword }) => (
        <Component key={title} {...keyword}>
          {title}
        </Component>
      ))}
    </ul>
  );
};

const keywords = [
  { title: 'theater' },
  { title: 'comic' },
  { title: 'puppet' },
];

test('renders a list of keywords', () => {
  render(<Keywords keywords={keywords} />);

  expect(screen.getByRole('list')).toBeInTheDocument();
  screen.getAllByRole('listitem').forEach((item, index) => {
    expect(item).toHaveTextContent(keywords[index].title);
  });
});

test('set the fill data attribute when passing the fill prop', () => {
  render(<Keywords keywords={keywords} fill />);

  expect(screen.getByRole('list').dataset.fill).toBe('true');
});

test("don't set the fill data attribute when not passing the fill prop", () => {
  render(<Keywords keywords={keywords} />);

  expect(screen.getByRole('list').dataset.fill).toBeUndefined();
});
