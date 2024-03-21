import { useContext } from 'react';
import { UserContext } from '../../UserContextProvider';
import { DarkLinkButton } from '../reusables/NewButtons';
import PlaylistListItem from '../playlist-components/PlaylistListItem';
import { AppContext } from '../../AppContextProvider';

export default function LikedPlaylists() {
  const { likes } = useContext(UserContext);
  const { navigate } = useContext(AppContext);

  const viewAllClick = () => {
    navigate('/playlist/liked');
  };

  const sortedLikes = likes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const shortenedLikes = sortedLikes.slice(0, 3);

  return (
    <div className='dashboardItem rounded-lg shadow-md p-6 h-full flex flex-col justify-between'>
      <h2 className='text-2xl text-themeNavy mb-4'>Playlists you&apos;ve liked:</h2>
      {likes.length === 0 ? (
        <p className='text-themeMidBlue text-center'>You haven&apos;t liked anything yet</p>
      ) : (
        <ul className='flex-1'>
          {shortenedLikes.map((playlist, index) => (
            <PlaylistListItem playlist={playlist} colourNum={(index % 3) + 1} key={playlist._id} />
          ))}
        </ul>
      )}
      <DarkLinkButton buttonText={'View all'} action={viewAllClick} />
    </div>
  );
}
