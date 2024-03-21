import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePlaylistPage from './pages/CreatePlaylistPage';
import UserPlaylistsPage from './pages/UserPlaylistsPage';
import UserDashboard from './pages/UserDashboard';
import UserSettingsPage from './pages/UserSettingsPage';
import BrowsePlaylistsPage from './pages/BrowsePlaylistsPage';
import SinglePlaylistPage from './pages/SinglePlaylistPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FollowingPlaylistsPage from './pages/FollowingPlaylistsPage';
import LikedPlaylistsPage from './pages/LikedPlaylistsPage';
import UserProfilePage from './pages/UserProfilePage';
import ErrorPages from './pages/ErrorPages';

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path='register' element={<RegisterPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='search-result' element={<SearchResultsPage />} />

        <Route path='playlist'>
          <Route index element={<BrowsePlaylistsPage />} />
          <Route path=':id' element={<SinglePlaylistPage />} />
          <Route path='liked' element={<LikedPlaylistsPage />} />
          <Route path='following' element={<FollowingPlaylistsPage />} />
        </Route>

        <Route path='user'>
          <Route path=':id' element={<UserProfilePage />} />
        </Route>

        <Route path='user-settings' element={<UserSettingsPage />} />
        <Route path='/create-playlist' element={<CreatePlaylistPage />} />
        <Route path='user-playlists' element={<UserPlaylistsPage />} />
        <Route path='user-dashboard' element={<UserDashboard />} />

        <Route path='*' element={<ErrorPages />}>
          <Route path=':errorType' element={<ErrorPages />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
