import DefaultLayout from '../components/layout/DefaultLayout';
import { useContext, useEffect } from 'react';
import { AppContext } from '../AppContextProvider';
import PlaylistBrowser from '../components/playlist-components/PlaylistBrowser';

export default function BrowsePlaylistsPage() {
  const { playlists, playlistsLoading } = useContext(AppContext);

  return (
    <DefaultLayout pageTitle={'Playlists'}>
      <PlaylistBrowser playlists={playlists} browserTitle={'Playlists'} largeCard={true} />
      {playlistsLoading && <p>Loading...</p>}
    </DefaultLayout>
  );
}
