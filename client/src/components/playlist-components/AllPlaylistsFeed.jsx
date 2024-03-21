import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppContextProvider';
import { LightButton, LightLinkButton } from '../reusables/NewButtons';
import PlaylistFeedItem from './PlaylistFeedItem';
import LoadingPartial from '../reusables/LoadingPartial';
import { useInterval } from '../../hooks/useInterval';

export default function AllPlaylistsFeed() {
  const { playlists, refreshPlaylists, navigate } = useContext(AppContext);
  const [numPlaylists, setNumPlaylists] = useState(5);
  const [recentPlaylists, setRecentPlaylists] = useState([]);

  const sortPlaylists = (playlists) => {
    playlists.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  useEffect(() => {
    sortPlaylists(playlists);
    setRecentPlaylists(playlists.slice(0, numPlaylists));
  }, [playlists, numPlaylists]);

  useInterval(() => {
    refreshPlaylists();
    sortPlaylists(playlists);
    setRecentPlaylists(playlists.slice(0, numPlaylists));
  }, 5000);

  const handleCollapseAll = () => {
    setNumPlaylists(5);
  };

  const handleShowMore = () => {
    setNumPlaylists(numPlaylists + 5);
  };

  const handleBrowseAll = () => {
    navigate('/playlist');
  };

  if (!playlists) {
    return <LoadingPartial />;
  } else {
    return (
      <>
        <div className='bg-themeNavy px-10 mt-10'>
          <h3 className='text-2xl text-themePalePink p-6 text-center'>
            Recently created playlists
          </h3>
          <ul className='feedList divide-y divide-themePalePink'>
            {recentPlaylists.map((playlist, index) => (
              <PlaylistFeedItem
                playlist={playlist}
                colourNum={(index % 3) + 1}
                key={playlist._id}
              />
            ))}
          </ul>
          <div className='text-center p-4'>
            {playlists.length > numPlaylists && (
              <LightLinkButton buttonText={'Show more'} action={handleShowMore} />
            )}
            {numPlaylists > 5 && (
              <LightLinkButton buttonText={'Collapse all'} action={handleCollapseAll} />
            )}
          </div>
        </div>
        <div className='text-center pt-4'>
          <LightButton buttonText={'Browse all playlists'} action={handleBrowseAll} />
        </div>
      </>
    );
  }
}
