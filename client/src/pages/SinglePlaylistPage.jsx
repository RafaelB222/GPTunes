import DefaultLayout from '../components/layout/DefaultLayout';
import SinglePlaylistView from '../components/playlist-components/SinglePlaylistView';
import { useContext, useEffect, useState } from 'react';
import LoadingPartial from '../components/reusables/LoadingPartial';
import { AppContext } from '../AppContextProvider';
import { useParams } from 'react-router-dom';
import { useInterval } from '../hooks/useInterval';

export default function SinglePlaylistPage() {
  const { playlists, navigate } = useContext(AppContext);
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const maxIntervalCount = 3;
  let [intervalCount, setIntervalCount] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  });

  useInterval(() => {
    const foundPlaylist = playlists.find((a) => a._id === id);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
      setIntervalCount(null);
    } else {
      setIntervalCount(intervalCount + 1);
    }
    if (intervalCount == maxIntervalCount) {
      navigate('/playlistNotFound');
    }
  }, 1000);

  if (!playlist) {
    return <LoadingPartial />;
  }

  return (
    <DefaultLayout>
      <SinglePlaylistView playlist={playlist} />
    </DefaultLayout>
  );
}
