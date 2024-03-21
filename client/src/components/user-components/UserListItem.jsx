import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppContextProvider';
import playlistColours from '../../util/playlistColours';
import { useInterval } from '../../hooks/useInterval';
import LoadingComponent from '../reusables/LoadingComponent';

/**
 * Displays a summary of a Users information for use in lists (search results, following/follower lists)
 */
export default function UserListItem({ user, colourNum }) {
  const { IMAGE_URL, playlists } = useContext(AppContext);
  const [totalPlaylists, setTotalPlaylists] = useState();

  let image;
  if (user.image_url) {
    image = IMAGE_URL + user.image_url;
  } else {
    image = playlistColours(colourNum);
  }

  //load and update the total playlist count for a user
  useEffect(() => {
    const getTotal = userTotalPlaylists();
    setTotalPlaylists(getTotal);
  }, [totalPlaylists]);

  useInterval(() => {
    setTotalPlaylists(userTotalPlaylists());
  }, 1000);

  const userTotalPlaylists = () => {
    let count = 0;
    for (const playlist of playlists) {
      if (playlist.user && playlist.user._id == user._id) {
        count++;
      }
    }
    return count;
  };

  if (!totalPlaylists) {
    return <LoadingComponent />;
  }

  return (
    <li className='playlistListItem p-4 flex justify-between items-center'>
      <img className='listSizeImage p-3' src={image} alt={`${user.first_name}'s profile picture`} />
      <div>
        <Link to={`/user/${user._id}`}>
          <h4 className='text-lg mb-2 hover:underline'>
            {user.first_name} {user.last_name}
          </h4>
        </Link>
        {user.location && <p className='text-sm text-themePalePink mb-2'>{user.location}</p>}
      </div>
      <div>
        <p className='text-sm text-themePalePink'>{totalPlaylists} playlists</p>
      </div>
    </li>
  );
}
