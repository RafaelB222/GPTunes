import DefaultLayout from '../components/layout/DefaultLayout';
import { useContext } from 'react';
import { UserContext } from '../UserContextProvider';
import PlaylistBrowser from '../components/playlist-components/PlaylistBrowser';

export default function UserPlaylistsPage() {
  const { userPlaylists } = useContext(UserContext);

  return (
    <DefaultLayout pageTitle={'Your playlists'}>
      <div className='container mx-auto px-4 py-8'>
        <PlaylistBrowser playlists={userPlaylists} newPlaylistOption={true} />
      </div>
    </DefaultLayout>
  );
}
