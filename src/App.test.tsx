import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('App Component', () => {
  test('renders login page by default', () => {
    render(<App />);
    expect(screen.getByText(/вход/i)).toBeInTheDocument();
    expect(screen.getByText(/войти/i)).toBeInTheDocument();
    expect(screen.getByText(/зарегистрироваться/i)).toBeInTheDocument();
  });

  test('renders footer with contact information', () => {
    render(<App />);
    expect(screen.getByText(/контакты/i)).toBeInTheDocument();
    expect(screen.getByText(/giyesidinov\.i\.i@edu\.mirea\.ru/i)).toBeInTheDocument();
    expect(screen.getByText(/режим работы/i)).toBeInTheDocument();
  });
});
