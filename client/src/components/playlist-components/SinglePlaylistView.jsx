import { useContext } from 'react';
import { AppContext } from '../../AppContextProvider';
import { getTimeSinceCreation } from '../../util/timeUtils';
import { DarkButton, DarkLinkButton } from '../reusables/NewButtons';
import CommentSystem from '../comments/CommentSystem';
import { exportPlaylistToSpotify } from '../../util/exportPlaylist';
import { LikeButton, LikeButtonNoUser } from '../reusables/LikeButton';

export default function SinglePlaylistView({ playlist }) {
  const { navigate, user, IMAGE_URL, BASE_URL, refreshPlaylists } = useContext(AppContext);

  const allGenres = playlist.songs.flatMap((song) => song.genre);
  const uniqueGenres = Array.from(new Set(allGenres));

  const genreColors = [
    'bg-rose-300',
    'bg-blue-400',
    'bg-orange-500',
    'bg-rose-400',
    'bg-blue-300',
    'bg-orange-400',
    'bg-rose-500',
    'bg-blue-400',
    'bg-orange-300',
  ];

  const createGenreColorMap = (genres, colors) => {
    const genreColorMap = new Map();
    genres.forEach((genre, index) => {
      genreColorMap.set(genre, colors[index % colors.length]);
    });
    return genreColorMap;
  };

  const genreColorMap = createGenreColorMap(uniqueGenres, genreColors);

  return (
    <>
      <div className='border-b-2 border-themeNavy flex text-left justify-around items-center m-4 px-6 pb-2'>
        <div>
          {playlist.playlist_image && (
            <img
              className='playlistImage'
              src={IMAGE_URL + playlist.playlist_image}
              alt={`Cover image for ${playlist.title}`}
            />
          )}
        </div>
        <div className='p-4'>
          <h2 className='text-2xl text-themeNavy mb-2 pt-4'>{playlist.title}</h2>
          {playlist.user && (
            <div className='text-sm pb-4'>
              Created by{' '}
              <DarkLinkButton
                buttonText={`${playlist.user.first_name} ${playlist.user.last_name}`}
                action={() => navigate(`/user/${playlist.user._id}`)}
              />{' '}
              {getTimeSinceCreation(playlist.createdAt)}
            </div>
          )}

          <p className='text-md my-2'>{playlist.description}</p>
          <div className='mt-4 flex flex-wrap gap-2'>
            {uniqueGenres.map((genre, index) => (
              <div
                key={index}
                className={`p-1.5 rounded-md text-white ${genreColorMap.get(genre)}`}
              >
                <p className='text-sm'>{genre}</p>
              </div>
            ))}
          </div>
          <p className='text-sm font-medium py-2'>{playlist.songs.length} songs</p>
        </div>
        {user ? (
          <>
            <span className='text-themeMidPink font-bold self-start justify-self pt-4'>
              <LikeButton
                playlist={playlist}
                user={user}
                refreshPlaylists={refreshPlaylists}
                className='flex flex-row self-start justify-self-end pt-4'
              />
            </span>
          </>
        ) : (
          <>
            <span className='flex flex-col items-end self-start justify-self-end pt-4 text-right'>
              <LikeButtonNoUser
                playlist={playlist}
                navigate={navigate}
                className='text-themeMidPink flex flex-row font-bold pt-4'
              />
              Log in to start liking playlists
            </span>
          </>
        )}
      </div>

      <div className='bg-themeNavy w-full'>
        <ol type='1' className='songContainer p-4 text-center items-center divide-y'>
          {playlist.songs.map((song) => (
            <li key={song._id} className='song flex justify-between pt-4'>
              <h3 className='text-lg text-themePalePink'>{song.title}</h3>
              <p className='text-themePalePink pl-4'>{song.artist}</p>
            </li>
          ))}
        </ol>
        <div className='text-center p-4'>
          {user && user.spotifyId != '' && (
            <DarkButton
              buttonText={'Export Playlist'}
              action={() => exportPlaylistToSpotify(playlist, BASE_URL, user)}
            />
          )}
        </div>
      </div>
      <div className='w-full bg-themeNavy'>{user && <CommentSystem />}</div>
    </>
  );
}
