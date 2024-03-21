import '@testing-library/jest-dom';
import { expect, test } from 'vitest';
import { AppContext } from '../AppContextProvider';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';

const user = {
  _id: '000000000000000000000001',
  first_name: 'Mojo',
  last_name: 'Jojo',
  email: 'mojojojo@cartoonnetwork.com',
  password: 'evil',
  following: [],
  location: 'Auckland',
  spotify_refresh_token: '',
  spotify_id: '',
  image_url: '../../../server/public/images/powerpuff-mojo.jpg',
};

test('form information added correctly to fields', async () => {
  const { getByRole, getByText, container } = render(
    <MemoryRouter initialEntries={['/register']}>
      <AppContext.Provider value={{ user: null }}>
        <RegisterPage />
      </AppContext.Provider>
    </MemoryRouter>,
  );

  expect(getByText('Register Now')).toBeInTheDocument();

  const firstName = container.querySelector('input[name="firstName"]');
  const lastName = container.querySelector('input[name="lastName"]');
  const email = container.querySelector('input[name="email"]');
  const password = container.querySelector('input[name="password"]');
  const location = container.querySelector('select[name="location"');
  const locationOption = getByText('Auckland');

  await waitFor(() => {
    fireEvent.change(firstName, {
      target: {
        value: user.first_name,
      },
    });
  });

  await waitFor(() => {
    fireEvent.change(lastName, {
      target: {
        value: user.last_name,
      },
    });
  });

  await waitFor(() => {
    fireEvent.change(email, {
      target: {
        value: user.email,
      },
    });
  });

  await waitFor(() => {
    fireEvent.change(password, {
      target: {
        value: user.password,
      },
    });
  });

  await waitFor(() => {
    fireEvent.change(location, {
      target: {
        value: locationOption,
      },
    });
  });

  const regBtn = getByRole('button', { name: /Register/i });
  expect(regBtn).toBeInTheDocument();

  await waitFor(() => {
    fireEvent.click(regBtn);
  });
});

test('flags required input left empty upon submit', async () => {
  const { getAllByText, getByText, getByRole, container } = render(
    <MemoryRouter initialEntries={['/register']}>
      <AppContext.Provider value={{ user: null }}>
        <RegisterPage />
      </AppContext.Provider>
    </MemoryRouter>,
  );

  expect(getByText('Register Now')).toBeInTheDocument();

  const firstName = container.querySelector('input[name="firstName"]');
  const email = container.querySelector('input[name="email"]');
  const password = container.querySelector('input[name="password"]');
  const location = container.querySelector('select[name="location"');
  const locationOption = getByText('Auckland');

  await waitFor(() => {
    fireEvent.change(firstName, {
      target: {
        value: user.first_name,
      },
    });
  });

  //last name left blank

  await waitFor(() => {
    fireEvent.change(email, {
      target: {
        value: user.email,
      },
    });
  });

  await waitFor(() => {
    fireEvent.change(password, {
      target: {
        value: user.password,
      },
    });
  });

  await waitFor(() => {
    fireEvent.change(location, {
      target: {
        value: locationOption,
      },
    });
  });

  const regBtn = getByRole('button', { name: /Register/i });
  expect(regBtn).toBeInTheDocument();

  await waitFor(() => {
    fireEvent.click(regBtn);
  });

  getAllByText('Required');
});
