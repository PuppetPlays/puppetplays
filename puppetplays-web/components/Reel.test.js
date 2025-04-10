import React from 'react';
import { render, screen } from '@testing-library/react';
import Reel from './Reel';

// Mock ZoomableImage component
jest.mock('./ZoomableImage', () => ({ children }) => <div data-testid="zoomable-image">{children}</div>);

describe('Reel component', () => {
  // Mock IntersectionObserver
  beforeAll(() => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  test('renders empty state when no images provided', () => {
    const { container } = render(<Reel />);
    
    // The component should render with empty children
    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(list.children.length).toBe(0);
    
    // Navigation buttons should be hidden
    const navButtons = container.querySelector('[hidden]');
    expect(navButtons).toBeInTheDocument();
  });

  test('renders empty state with null images prop', () => {
    const { container } = render(<Reel images={null} />);
    
    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(list.children.length).toBe(0);
  });

  test('renders empty state with empty array of images', () => {
    const { container } = render(<Reel images={[]} />);
    
    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(list.children.length).toBe(0);
  });

  test('renders properly with images', () => {
    const mockImages = [
      { id: '1', url: 'image1.jpg', alt: 'Image 1', width: 200 },
      { id: '2', url: 'image2.jpg', alt: 'Image 2', width: 300, description: 'Test description' }
    ];
    
    render(<Reel images={mockImages} />);
    
    // Should render correct number of images
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(2);
    
    // Images should have correct attributes
    expect(images[0]).toHaveAttribute('src', 'image1.jpg');
    expect(images[0]).toHaveAttribute('alt', 'Image 1');
    expect(images[1]).toHaveAttribute('src', 'image2.jpg');
    
    // Description should be rendered when available
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('renders with bleed style when bleed prop is true', () => {
    const { container } = render(<Reel bleed={true} />);
    
    const reelContainer = container.firstChild;
    expect(reelContainer).toHaveClass('isBleeding');
  });
}); 