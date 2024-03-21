import { Link } from 'react-router-dom';
import { getTimeSinceCreation } from '../../util/timeUtils';
import { useContext } from 'react';
import { AppContext } from '../../AppContextProvider';
import playlistColours from '../../util/playlistColours';
import { DarkLinkButton } from '../reusables/NewButtons';

export default function PlaylistListItem({ playlist, colourNum }) {
  const { IMAGE_URL, navigate } = useContext(AppContext);
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
          <div className='text-sm pb-4'>
            <DarkLinkButton
              buttonText={`${playlist.user.first_name} ${playlist.user.last_name}`}
              action={() => navigate(`/user/${playlist.user._id}`)}
            />{' '}
            {getTimeSinceCreation(playlist.createdAt)}
          </div>
        )}
        {playlist.description && (
          <p className='text-sm p-2 hidden text-themePalePink mb-2 sm:block'>
            {playlist.description}
          </p>
        )}
      </div>
    </li>
  );
}
