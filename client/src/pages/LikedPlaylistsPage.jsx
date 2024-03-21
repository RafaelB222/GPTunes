import DefaultLayout from '../components/layout/DefaultLayout';
import { UserContext } from '../UserContextProvider';
import PlaylistBrowser from '../components/playlist-components/PlaylistBrowser';
import { useContext } from 'react';

export default function LikedPlaylistsPage() {
  const { likes } = useContext(UserContext);

  return (
    <DefaultLayout>
      <PlaylistBrowser playlists={likes} browserTitle={'Playlists you like'} largeCard={true} />
    </DefaultLayout>
  );
}
