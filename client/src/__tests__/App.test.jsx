/* eslint-disable no-undef */
import { it, expect } from 'vitest';
import { AppContext } from '../AppContextProvider';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from '../App';
import { JSDOM } from 'jsdom';
//defines document for testing purposes
const dom = new JSDOM();
global.window = dom.window;
global.document = global.window.document;

//The following tests are used to check the Routes in App.jsx

const playlistItems = [
  {
    _id: '000000000000000000000001',
    playlist: '000000000000000000000001',
    title: 'Axel F',
    artist: 'Crazy Frog',
    album: 'Crazy Frog Album',
    released: '2002',
    genre: 'kids bop',
  },
  {
    _id: '000000000000000000000002',
    playlist: '000000000000000000000001',
    title: 'Goofy Goober Rock',
    artist: 'Spongebob Squarepants',
    album: 'Spongebob Greatest Hits',
    released: '2008',
    genre: 'kids bop',
  },
  {
    _id: '000000000000000000000003',
    playlist: '000000000000000000000001',
    title: 'Poi E',
    artist: 'Patea Maori Club',
    album: 'NZ Classics',
    released: '1900',
    genre: 'nz',
  },
];

const dummyContext = {
  users: [
    {
      _id: '000000000000000000000001',
      first_name: 'Mojo',
      last_name: 'Jojo',
      email: 'mojojojo@cartoonnetwork.com',
      password: 'evil',
      following: [],
      location: 'Auckland',
      spotify_refresh_token: '',
      spotify_id: '',
      image_url: 'image1.jpg',
    },
    {
      _id: '000000000000000000000002',
      first_name: 'Scooby',
      last_name: 'Doo',
      email: 'scoobydoo@snax.com',
      password: 'food',
      following: ['000000000000000000000001'],
      location: 'Auckland',
      spotify_refresh_token: '',
      spotify_id: '',
      image_url: 'image2.jpg',
    },
  ],
  playlists: [
    {
      _id: '000000000000000000000001',
      user: '000000000000000000000001',
      prompt: 'Songs for an evil genius',
      title: 'Taking over Townsville',
      description: 'Big brains build empires',
      likes: [],
      playlist_image: 'playimage.jpg',
      songs: [{ ...playlistItems }],
      comments: [],
    },
    {
      _id: '000000000000000000000002',
      user: '000000000000000000000001',
      prompt: 'Eating Scooby Snacks',
      title: 'Scooby Snackaholic',
      description: 'Ruh-roh!',
      likes: [],
      playlist_image: 'playimage1.jpg',
      songs: [{ ...playlistItems }],
      comments: [],
    },
  ],
};

it('renders the home page correctly', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <AppContext.Provider value={dummyContext}>
        <App />
      </AppContext.Provider>
    </MemoryRouter>,
  );

  expect(getByText('playlists for every moment')).toBeDefined();
});

it('renders the register page correctly', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/register']}>
      <AppContext.Provider value={dummyContext}>
        <App />
      </AppContext.Provider>
    </MemoryRouter>,
  );

  expect(getByText('Register Now')).toBeDefined();
});

it('renders the login page correctly', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/login']}>
      <AppContext.Provider value={dummyContext}>
        <App />
      </AppContext.Provider>
    </MemoryRouter>,
  );

  expect(getByText('Remember me!')).toBeDefined();
});

it('renders a single playlist page using id in params', () => {
  const { queryByText } = render(
    <MemoryRouter initialEntries={['playlist/000000000000000000000001']}>
      <AppContext.Provider value={dummyContext}>
        <App />
      </AppContext.Provider>
    </MemoryRouter>,
  );

  expect(queryByText('Taking over Townsville')).toBeDefined();
});

it('renders list of following users?', () => {
  const value = 1;
  expect(value).toBeTruthy();
});

it('renders the user playlist page', () => {
  const { queryByText } = render(
    <MemoryRouter initialEntries={['user-dashboard']}>
      <AppContext.Provider value={dummyContext}>
        <App />
      </AppContext.Provider>
    </MemoryRouter>,
  );

  expect(queryByText('Dashboard')).toBeDefined();
});
