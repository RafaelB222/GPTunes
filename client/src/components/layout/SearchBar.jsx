import { useContext, useState } from 'react';
import axios from 'axios';
import search from '../../assets/icons/search.png';
import { AppContext } from '../../AppContextProvider';

export default function SearchBar() {
  const { BASE_URL, navigate, setSearchResults } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleIconClick = () => {
    setOpen(!open);
    setInput('');
  };

  const handleKeyEvent = async (e) => {
    if (e.key === 'Enter' || e.key === 'Return') {
      handleSearchGo();
    }
  };

  const handleSearchGo = async () => {
    const trimmedQuery = input.trim();
    if (trimmedQuery) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/search?query=${trimmedQuery}`);
        setSearchResults(response);
        setIsLoading(false);
        navigate('/search-result');
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {open && (
        <div
          className='flex flex-row items-center rounded-lg border-2 border-themeNavy mr-4'
          tabIndex={0}
          onKeyDown={handleKeyEvent}
        >
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Search'
            className='flex-1 bg-transparent border-none focus:ring-transparent text-themeNavy placeholder-themeNavy focus:outline-none'
            disabled={isLoading}
          />
          <button
            type='button'
            onClick={handleSearchGo}
            className='text-sm text-themePalePink bg-themeNavy p-3 rounded-xlg h-full hover:bg-opacity-90 focus:outline-none'
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Go'}
          </button>
        </div>
      )}

      <button onClick={handleIconClick} className='focus:outline-none'>
        <img src={search} alt='Search icon' className='searchIcon' />
      </button>
    </>
  );
}
