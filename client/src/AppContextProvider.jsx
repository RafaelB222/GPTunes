import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGet } from './hooks/useGet';

const AppContext = React.createContext({
  playlists: [],
  users: [],
  BASE_URL: '',
  auth: '',
});
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ?? '';

function AppContextProvider({ children }) {
  // fetch all playlists
  const {
    data: playlists,
    isLoading: playlistsLoading,
    refresh: refreshPlaylists,
  } = useGet(`${API_BASE_URL}/playlist`, []);

  // fetch all users
  const {
    data: users,
    isLoading: usersLoading,
    refresh: refreshUsers,
  } = useGet(`${API_BASE_URL}/user`, []);

  const navigate = useNavigate();

  const [user, setUser] = useLocalStorage('user');
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useLocalStorage('auth');
  const [currentPlaylist, setCurrentPlaylist] = useState({});
  const [currentProfile, setCurrentProfile] = useState({});
  const [profilePlaylists, setProfilePlaylists] = useState([]);
  const [searchResults, setSearchResults] = useState({});
  const [message, setMessage] = useState('');

  const BASE_URL = API_BASE_URL;
  const IMAGE_URL = IMAGE_BASE_URL;

  const handleLogOut = () => {
    setAuth(null);
    setUser(null);
    window.localStorage.removeItem('auth');
    window.localStorage.removeItem('user');
    refreshPlaylists();
    refreshUsers();
    navigate('/');
  };

  function userProfilePlaylists(user) {
    profilePlaylists.splice(0, profilePlaylists.length);
    if (user) {
      if (!playlistsLoading && playlists) {
        for (const playlist of playlists) {
          if (playlist.user && playlist.user._id === user._id) {
            profilePlaylists.push(playlist);
          }
        }
        setProfilePlaylists[profilePlaylists];
      }
    }
  }

  useEffect(() => {
    const data = window.localStorage.getItem('auth');
    if (data !== null) {
      setAuth(JSON.parse(data));
    }
  }, [auth]);

  const context = {
    user,
    setUser,
    auth,
    setAuth,
    loading,
    setLoading,
    searchResults,
    setSearchResults,
    currentPlaylist,
    setCurrentPlaylist,
    currentProfile,
    profilePlaylists,
    setCurrentProfile,
    handleLogOut,
    message,
    setMessage,
    navigate,
    BASE_URL,
    IMAGE_URL,
    playlists,
    playlistsLoading,
    refreshPlaylists,
    users,
    usersLoading,
    userProfilePlaylists,
    refreshUsers,
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

export { AppContext, AppContextProvider };
