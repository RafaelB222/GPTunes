/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { getTimeSinceCreation } from '../../util/timeUtils';
import { AppContext } from '../../AppContextProvider';
import { UserContext } from '../../UserContextProvider';
import { PinkButton, OrangeButton } from '../reusables/NewButtons';
import { Link } from 'react-router-dom';
import { LikeButton, LikeButtonNoUser } from '../reusables/LikeButton';
import playlistColours from '../../util/playlistColours';
import axios from 'axios';

export default function PlaylistCard({ playlist, colourNum }) {
  const { navigate, user, IMAGE_URL, auth, BASE_URL, refreshPlaylists, refreshUsers } =
    useContext(AppContext);
  const { refreshUserPlaylists, refreshLikes } = useContext(UserContext);

  let image;
  if (playlist.playlist_image) {
    image = IMAGE_URL + playlist.playlist_image;
  } else {
    image = playlistColours(colourNum);
  }

  const goToPlaylist = () => {
    navigate(`/playlist/${playlist._id}`);
  };

  const handleDeleteClicked = async () => {
    await axios.delete(`${BASE_URL}/playlist/delete/${playlist._id}`, {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    });
    refreshPlaylists();
    refreshUserPlaylists();
    refreshUsers();
    refreshLikes();
    navigate('/user-playlists');
  };

  return (
    <>
      <div className='rounded-md border-2 border-themeNavy mx-auto my-4 px-6 w-full h-full'>
        <div className='flex flex-col content-center text-right'>
          <Link to={`/playlist/${playlist._id}`}>
            <h2 className='text-2xl text-themeNavy mb-2 pt-4 truncate'>{playlist.title}</h2>
          </Link>
          <div className='flex flex-row'>
            <div className='p-2 flex flex-col content-around justify-center'>
              {user ? (
                <>
                  <span className='text-themeMidPink font-bold place-self-end'>
                    <LikeButton
                      playlist={playlist}
                      user={user}
                      refreshPlaylists={refreshPlaylists}
                    />
                  </span>
                </>
              ) : (
                <>
                  <span className='flex flex-col items-end text-right '>
                    <LikeButtonNoUser playlist={playlist} navigate={navigate} />
                    Log in to start liking playlists
                  </span>
                </>
              )}
              {playlist.user && (
                <div className='text-sm pb-4 text-themeMidPink'>
                  {'Created ' + getTimeSinceCreation(playlist.createdAt)}
                </div>
              )}
              <p className='text-sm font-medium py-2'>{playlist.songs.length} songs</p>
            </div>
            <div className='self-center w-full'>
              <img
                className='border-2 border-themeNavy rounded-md object-contain align-middle m-2 w-full lg:w-full md:w-full'
                src={image}
                alt={`Cover image for ${playlist.title}`}
              />
            </div>
          </div>
          <div className='px-10 py-2 text-center flex flex-row justify-evenly lg:flex-row sm:flex-col'>
            <PinkButton
              buttonText={'View Playlist'}
              action={goToPlaylist}
              colour={'themeMidPink'}
            />
            {user && playlist.user._id === user._id ? (
              <OrangeButton buttonText={'Delete'} action={handleDeleteClicked} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
