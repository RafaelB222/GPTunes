/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { getTimeSinceCreation } from '../../util/timeUtils';
import { AppContext } from '../../AppContextProvider';
import { PinkButton } from '../reusables/NewButtons';
import playlistColours from '../../util/playlistColours';
import { Link } from 'react-router-dom';
import { LikeButton, LikeButtonNoUser } from '../reusables/LikeButton';

export default function PlaylistCardLarge({ playlist, colourNum }) {
  const { navigate, user, IMAGE_URL, refreshPlaylists } = useContext(AppContext);

  let image;
  if (playlist.playlist_image) {
    image = IMAGE_URL + playlist.playlist_image;
  } else {
    image = playlistColours(colourNum);
  }

  const goToPlaylist = () => {
    navigate(`/playlist/${playlist._id}`);
  };

  return (
    <>
      <div className='playlistCardLarge rounded-md border-2 border-themeNavy flex text-left items-center mt-10 mb-10 lg:m-16'>
        <div className='justify-self-center'>
          <img className='playlistImage' src={image} alt={`Cover image for ${playlist.title}`} />
        </div>
        <div className='p-4'>
          <Link to={`/playlist/${playlist._id}`}>
            <h2 className='text-2xl text-themeNavy mb-2 pt-4'>{playlist.title}</h2>
          </Link>
          {playlist.user && (
            <Link to={`/user/${playlist.user._id}`}>
              <p className='text-sm pb-4'>
                Created by {playlist.user.first_name} {playlist.user.last_name}{' '}
                {getTimeSinceCreation(playlist.createdAt)}
              </p>
            </Link>
          )}

          <p className='text-md my-2'>{playlist.description}</p>
          <p className='text-sm font-medium py-2'>{playlist.songs.length} songs</p>
          <PinkButton buttonText={'View Playlist'} action={goToPlaylist} colour={'themeMidPink'} />
        </div>
        {user ? (
          <>
            <span className='text-themeMidPink font-bold self-start absolute place-self-end pt-4 mr-10'>
              <LikeButton playlist={playlist} user={user} refreshPlaylists={refreshPlaylists} />
            </span>
          </>
        ) : (
          <>
            <span className='flex flex-col items-end self-start justify-self-end place-self-end p-4 text-right'>
              <LikeButtonNoUser playlist={playlist} navigate={navigate} />
              Log in to start liking playlists
            </span>
          </>
        )}
      </div>
    </>
  );
}
