import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock antd components to avoid issues in test environment
jest.mock('antd', () => ({
  Layout: ({ children }: any) => <div data-testid="layout">{children}</div>,
  ConfigProvider: ({ children }: any) => <div>{children}</div>,
}));

test('renders app component', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  const layoutElement = screen.getByTestId('layout');
  expect(layoutElement).toBeInTheDocument();
});

export {};