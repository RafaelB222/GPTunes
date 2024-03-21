import { useContext, useState } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import usePagination from '../../hooks/usePagination';
import PlaylistCardLarge from './PlaylistCardLarge';
import PlaylistCard from './PlaylistCard';
import { AppContext } from '../../AppContextProvider';

export default function PlaylistBrowser({ playlists, largeCard, newPlaylistOption }) {
  const [playlistsPerPage] = useState(7);
  const [sortBy, setSortBy] = useState('date');
  const isMobile = useMediaQuery('(max-width: 640px)');

  const sortedPlaylists = [...playlists].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'likes') {
      return b.likes.length - a.likes.length;
    }
  });

  const { currentPage, setCurrentPage, visibleItems, pageButtons, canGoNextPage } = usePagination(
    sortedPlaylists,
    playlistsPerPage,
    isMobile,
    1,
    5,
  );

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <>
      <div className='flex flex-col justify-center items-center w-full h-full'>
        <div className='items-center self-end mr-20'>
          <label htmlFor='sort-by' className='mr-2 mt-2'>
            Sort by:
          </label>
          <select
            id='sort-by'
            className='py-1 border bg-transparent rounded focus:ring-transparent focus:border-themeMidPink'
            value={sortBy}
            onChange={handleSortByChange}
          >
            <option value='title'>Title</option>
            <option value='date'>Date created</option>
            <option value='likes'>Likes</option>
          </select>
        </div>
        <div
          className={`${
            largeCard ? '' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          } w-11/12 gap-4`}
        >
          {newPlaylistOption ? <NewPlaylistOptionLarge /> : ''}
          {visibleItems.map((playlist, index) => (
            <div key={playlist._id}>
              {largeCard && !isMobile ? (
                <PlaylistCardLarge playlist={playlist} colourNum={(index % 3) + 1} />
              ) : (
                <PlaylistCard playlist={playlist} colourNum={(index % 3) + 1} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className='flex justify-center mt-8'>
          <div className='flex items-center'>
            <button
              className={`bg-themeMidBlue text-themePalePink font-semibold py-2 px-4 border border-themeMidBlue rounded-l transition duration-300 ease-in-out focus:outline-none ${
                currentPage === 1 ? 'disabled:opacity-50 disabled:cursor-not-allowed' : ''
              }`}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className='sr-only'>Previous</span>
              <span className='text-sm'>Prev</span>
            </button>
            {pageButtons.map((buttonProps) => (
              <button key={buttonProps.key} {...buttonProps}>
                {buttonProps.key}
              </button>
            ))}
            <button
              className={`bg-themeMidBlue text-white font-semibold py-2 px-4 border border-themeMidBlue rounded-r transition duration-300 ease-in-out focus:outline-none ${
                !canGoNextPage ? 'disabled:opacity-50 disabled:cursor-not-allowed' : ''
              }`}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!canGoNextPage}
            >
              <span className='text-sm'>Next</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function NewPlaylistOptionLarge() {
  const { navigate } = useContext(AppContext);

  const handleNewPlaylist = () => {
    navigate('/create-playlist');
  };

  return (
    <div
      className='playlist-card text-center min-h-[300px] w-full h-full my-4 gap-4 bg-themeNavy rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:opacity-95 flex justify-center items-center flex-col cursor-pointer'
      onClick={handleNewPlaylist}
    >
      <div className='p-4'>
        <h2 className='text-4xl font-bold text-themePalePink'>+</h2>
        <p className='playlist-card-body text-themePalePink p-4'>Create a new playlist</p>
      </div>
    </div>
  );
}
