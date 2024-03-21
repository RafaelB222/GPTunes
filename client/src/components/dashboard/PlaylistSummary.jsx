import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContextProvider';
import { DarkLinkButton } from '../reusables/NewButtons';
import PlaylistListItem from '../playlist-components/PlaylistListItem';
import { AppContext } from '../../AppContextProvider';

export default function PlaylistSummary() {
  const { navigate } = useContext(AppContext);
  const { userPlaylists } = useContext(UserContext);
  const [recentPlaylists, setRecentPlaylists] = useState([]);

  const seeAllClick = () => {
    navigate('/user-playlists');
  };

  useEffect(() => {
    const sortedPlaylists = userPlaylists.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    setRecentPlaylists(sortedPlaylists.slice(0, 3));
  }, [userPlaylists]);

  return (
    <div className='dashboardItem rounded-lg shadow-md p-6 h-full flex flex-col justify-between'>
      <h2 className='text-2xl text-themeNavy mb-4'>Your recent playlists:</h2>
      <ul className='flex-1'>
        {recentPlaylists.map((playlist, index) => (
          <PlaylistListItem playlist={playlist} colourNum={(index % 3) + 1} key={playlist._id} />
        ))}
      </ul>
      <DarkLinkButton buttonText={'View all'} action={seeAllClick} />
    </div>
  );
}
