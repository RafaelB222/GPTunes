import '@testing-library/jest-dom';
import { expect, test } from 'vitest';
import { AppContext } from '../AppContextProvider';
import { render, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';
import { MemoryRouter } from 'react-router-dom';

test('log in button shows correctly, and in header', async () => {
  const { getByRole, getByText, container, queryByText } = render(
    <MemoryRouter initialEntries={['/login']}>
      <AppContext.Provider value={{ user: null }}>
        <LoginPage />
      </AppContext.Provider>
      ,
    </MemoryRouter>,
  );

  expect(getByText('Log In')).toBeInTheDocument();

  const email = container.querySelector('input[name="email"]');
  const password = container.querySelector('input[name="password"]');

  await waitFor(() => {
    fireEvent.change(email, {
      target: {
        value: 'mojojojo@cartoonnetwork.com',
      },
    });
  });

  await waitFor(() => {
    fireEvent.change(password, {
      target: {
        value: 'evil',
      },
    });
  });

  expect(email.value).toBe('mojojojo@cartoonnetwork.com');
  expect(password.value).toBe('evil');

  const loginBtn = getByRole('button', { name: /Submit/i });
  expect(loginBtn).toBeInTheDocument();

  await waitFor(() => {
    fireEvent.click(loginBtn);
  });

  await waitFor(() => {
    expect(queryByText('Dashboard'));
  });
});
