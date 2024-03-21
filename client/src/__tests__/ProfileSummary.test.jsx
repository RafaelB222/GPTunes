import '@testing-library/jest-dom';
import { expect, test, vi } from 'vitest';
import { AppContext } from '../AppContextProvider';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ProfileSummary from '../components/user-components/ProfileSummary';
import { UserContext } from '../UserContextProvider';

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
    {
      _id: '000000000000000000000003',
      first_name: 'Current',
      last_name: 'User',
      email: 'test@test.com',
      password: 'test',
      following: [],
      location: 'Auckland',
      spotify_refresh_token: '',
      spotify_id: '',
      image_url: 'image3.jpg',
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

const profile = {
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

test('renders the Profile Summary name and image correctly', () => {
  const { getByText, getByRole } = render(
    <AppContext.Provider
      value={{
        navigate: vi.fn(),
      }}
    >
      <UserContext.Provider
        value={{
          following: [dummyContext.users[1]],
          profileFollowers: [dummyContext.users[1]],
        }}
      >
        <ProfileSummary profile={profile} />
      </UserContext.Provider>
    </AppContext.Provider>,
  );

  //Check profile first name renders
  const nameElement = getByText(new RegExp(`${profile.first_name}`, 'i'));
  expect(nameElement).toBeInTheDocument();

  //Check profile image renders
  const imageElement = getByRole('img');
  expect(imageElement).toBeInTheDocument();
});

test('Follows a user properly', async () => {
  const followUnfollowMock = vi.fn();
  const { getByRole } = render(
    <AppContext.Provider
      value={{
        navigate: vi.fn(),
        user: dummyContext.users[2],
        refreshUsers: vi.fn(),
      }}
    >
      <UserContext.Provider
        value={{
          following: profile.following,
          profileFollowers: [dummyContext.users[1]],
          followUnfollow: followUnfollowMock,
          refreshFollowing: vi.fn(),
          refreshFollowers: vi.fn(),
        }}
      >
        <ProfileSummary profile={profile} />
      </UserContext.Provider>
    </AppContext.Provider>,
  );

  const currentFollowerCount = [dummyContext.users[1]].length;
  expect(currentFollowerCount).toBe(1);
  const followButton = getByRole('button', { name: /Follow/i });
  expect(followButton).toBeInTheDocument();

  fireEvent.click(followButton);

  let newFollowerCount;
  await waitFor(() => {
    expect(followUnfollowMock).toHaveBeenCalled();
    newFollowerCount = currentFollowerCount + 1;
  });

  expect(newFollowerCount).toBe(currentFollowerCount + 1);
});

test('Unfollows a user properly', async () => {
  const followUnfollowMock = vi.fn();
  const { queryByRole } = render(
    <AppContext.Provider
      value={{
        navigate: vi.fn(),
        user: dummyContext.users[1],
        refreshUsers: vi.fn(),
      }}
    >
      <UserContext.Provider
        value={{
          profileFollowers: [dummyContext.users[1]],
          following: [profile],
          followUnfollow: followUnfollowMock,
          refreshFollowing: vi.fn(),
          refreshFollowers: vi.fn(),
        }}
      >
        <ProfileSummary profile={profile} />
      </UserContext.Provider>
    </AppContext.Provider>,
  );

  const currentFollowerCount = [dummyContext.users[1]].length;
  expect(currentFollowerCount).toBe(1);
  const unfollowButton = queryByRole('button', { name: /Unfollow/i });
  await waitFor(() => expect(unfollowButton).toBeInTheDocument());

  fireEvent.click(unfollowButton);

  let newFollowerCount;
  await waitFor(() => {
    expect(followUnfollowMock).toHaveBeenCalled();
    newFollowerCount = currentFollowerCount - 1;
  });
  expect(newFollowerCount).toBe(currentFollowerCount - 1);
});

test('Unfollow button shown if already following', () => {
  const { queryByRole } = render(
    <AppContext.Provider
      value={{
        user: dummyContext.users[1],
        navigate: vi.fn(),
      }}
    >
      <UserContext.Provider
        value={{
          profileFollowers: [dummyContext.users[1]],
          following: profile,
          followUnfollow: vi.fn(),
          refreshFollowing: vi.fn(),
          refreshFollowers: vi.fn(),
        }}
      >
        <ProfileSummary profile={profile} />
      </UserContext.Provider>
    </AppContext.Provider>,
  );

  const unfollowButton = queryByRole('button', { name: /Unfollow/i });
  waitFor(() => expect(unfollowButton).toBeInTheDocument());
});

test('Unable to follow if not logged in, navigates to log in', () => {
  const { getByRole } = render(
    <AppContext.Provider
      value={{
        navigate: vi.fn(),
      }}
    >
      <UserContext.Provider
        value={{
          following: profile,
          profileFollowers: [dummyContext.users[0]],
          followUnfollow: vi.fn(),
          refreshFollowing: vi.fn(),
          refreshFollowers: vi.fn(),
        }}
      >
        <ProfileSummary profile={profile} />
      </UserContext.Provider>
    </AppContext.Provider>,
  );

  const loginButton = getByRole('button', { name: /Login to follow/i });
  expect(loginButton).toBeInTheDocument();
});

test('Edit account button shown when looking at your own profile, navigates to user settings', () => {
  const { getByRole } = render(
    <AppContext.Provider
      value={{
        user: dummyContext.users[1],
        navigate: vi.fn(),
      }}
    >
      <UserContext.Provider
        value={{
          following: profile,
          profileFollowers: [dummyContext.users[0]],
          followUnfollow: vi.fn(),
          refreshFollowing: vi.fn(),
          refreshFollowers: vi.fn(),
        }}
      >
        <ProfileSummary profile={dummyContext.users[1]} />
      </UserContext.Provider>
    </AppContext.Provider>,
  );

  const editAccountButton = getByRole('button', { name: /Edit your account/i });
  expect(editAccountButton).toBeInTheDocument();
});
