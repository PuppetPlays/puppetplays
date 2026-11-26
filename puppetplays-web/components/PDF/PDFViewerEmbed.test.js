import { render, screen } from '@testing-library/react';
import React from 'react';

import PDFViewerEmbed from './PDFViewerEmbed';

jest.mock('next-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}));

describe('PDFViewerEmbed', () => {
  // HAL answers every server-side fetch (Google Docs Viewer included) with
  // an anti-bot page, so the PDF can only be opened in the reader's browser.
  test('links to the PDF on HAL instead of embedding a third-party viewer', () => {
    const { container } = render(
      <PDFViewerEmbed
        halUrl="https://hal.science/hal-04457085v1/document"
        title="The ERC PuppetPlays Project"
      />,
    );

    const pdfLink = screen
      .getAllByRole('link')
      .find(
        link =>
          link.getAttribute('href') ===
          'https://hal.science/hal-04457085v1/document',
      );
    expect(pdfLink).toBeDefined();
    expect(pdfLink).toHaveAttribute('target', '_blank');
    expect(container.querySelector('iframe')).toBeNull();
  });
});
