import DefaultLayout from '../components/layout/DefaultLayout';
import { useContext } from 'react';
import { UserContext } from '../UserContextProvider';
import PlaylistBrowser from '../components/playlist-components/PlaylistBrowser';

export default function FollowingPlaylistsPage() {
  const { followingPlaylists } = useContext(UserContext);

  return (
    <DefaultLayout>
      <PlaylistBrowser
        playlists={followingPlaylists}
        browserTitle={'Playlists by users you follow'}
        largeCard={true}
      />
    </DefaultLayout>
  );
}
