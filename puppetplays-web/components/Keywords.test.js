import { render, screen } from '@testing-library/react';
import Keywords from './Keywords';

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

test('don’t set the fill data attribute when not passing the fill prop', () => {
  render(<Keywords keywords={keywords} />);

  expect(screen.getByRole('list').dataset.fill).toBeUndefined;
});
