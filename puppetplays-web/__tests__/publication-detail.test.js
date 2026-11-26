/**
 * @jest-environment node
 */

import React from 'react';
import { renderToString } from 'react-dom/server';

import PublicationDetailPage from '../pages/publications-scientifiques/[id]/[slug]';

jest.mock('components/Layout', () => {
  const Layout = ({ children }) => <>{children}</>;
  return Layout;
});
jest.mock('components/Footer', () => () => null);
jest.mock('lib/api', () => ({ getScientificPublicationById: jest.fn() }));
jest.mock('next/router', () => ({ useRouter: () => ({ locale: 'fr' }) }));
jest.mock('next-i18next/serverSideTranslations', () => ({
  serverSideTranslations: jest.fn(),
}));

const publication = {
  id: '420740',
  slug: 'the-erc-puppetplays-project',
  title: 'The ERC PuppetPlays Project',
  halCvLink: 'https://hal.science/hal-04457085v1/',
};

describe('Publication detail page', () => {
  // The link is the only way to read the PDF (HAL blocks embedded
  // previews), so it must be in the server HTML and point to a valid URL.
  test('server-renders the link to the HAL PDF from a link with a trailing slash', () => {
    const html = renderToString(
      <PublicationDetailPage publication={publication} error={null} />,
    );

    expect(html).toContain(
      'href="https://hal.science/hal-04457085v1/document"',
    );
  });
});
