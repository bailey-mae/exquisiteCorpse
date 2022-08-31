import { render, screen } from '@testing-library/react';
import App from './App';

test('it renders the canvas', () => {
  render(<App />);
  const canvas = screen.findByTestId("canvas");
  expect(canvas).toBeVisible;
});

