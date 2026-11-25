import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';

test('renders the app title and search input', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByText(/weather app/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search city/i)).toBeInTheDocument();
});
