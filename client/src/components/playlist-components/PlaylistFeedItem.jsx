import { Link } from 'react-router-dom';
import { getTimeSinceCreation } from '../../util/timeUtils';
import { useContext } from 'react';
import { AppContext } from '../../AppContextProvider';
import playlistColours from '../../util/playlistColours';

export default function PlaylistListItem({ playlist, colourNum }) {
  const { IMAGE_URL } = useContext(AppContext);
  let image;
  if (playlist.playlist_image) {
    image = IMAGE_URL + playlist.playlist_image;
  } else {
    image = playlistColours(colourNum);
  }

  return (
    <li className='playlistListItem p-4 flex justify-between items-center align-middle'>
      <img className='listSizeImage p-3' src={image} alt={`Cover image for ${playlist.title}`} />
      <div>
        <Link to={`/playlist/${playlist._id}`}>
          <h4 className='text-lg p-2 mb-2 hover:underline'>{playlist.title}</h4>
        </Link>
        {playlist.user && (
          <Link to={`/user/${playlist.user._id}`}>
            <p className='text-sm p-2 text-themePalePink mb-2'>
              By {playlist.user.first_name} {playlist.user.last_name}
            </p>
          </Link>
        )}
        {playlist.description && (
          <p className='text-sm p-2 hidden text-themePalePink mb-2 sm:block'>
            {playlist.description}
          </p>
        )}
      </div>
      <div>
        <p className='text-sm text-themePalePink'>{getTimeSinceCreation(playlist.createdAt)} </p>
      </div>
    </li>
  );
}
