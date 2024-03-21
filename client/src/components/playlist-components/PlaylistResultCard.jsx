/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../AppContextProvider';

const PlaylistResultCard = ({ playlist }) => {
  const { IMAGE_URL } = useContext(AppContext);

  return (
    <div className='bg-themeNavy flex flex-row mt-8 border-2 border-themePalePink items-center justify-between rounded-lg lg:w-3/4 xl:w-1/2 max-w-3xl mx-auto transition duration-300 ease-in-out transform hover:-translate-y-1 p-3 bg-opacity-10'>
      <div>
        <Link to={`/playlist/${playlist._id}`}>
          <h1 className='text-themePalePink text-2xl mb-2'>{playlist.title}</h1>
          <p className='text-themeMidPink'>{playlist.description}</p>

          <div className='mt-4 flex flex-wrap gap-2'>
            {playlist.songs.map((song, index) => (
              <div key={index} className='bg-themePalePink p-2 rounded-md'>
                <p className='text-themeOrange text-sm'>
                  {song.title} - {song.artist}
                </p>
              </div>
            ))}
          </div>
        </Link>
        <p className='text-themeMidBlue mt-4'>This playlist was generated entirely by AI, enjoy!</p>
      </div>
      <div>
        {playlist.playlist_image && (
          <img
            src={`${IMAGE_URL}${playlist.playlist_image}`}
            alt={`Cover image for ${playlist.title}`}
            className='listSizeImage border-2 border-themePalePink rounded-sm m-2'
          />
        )}
      </div>
    </div>
  );
};

export default PlaylistResultCard;
