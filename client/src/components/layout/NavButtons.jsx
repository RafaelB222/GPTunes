import { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppContext } from '../../AppContextProvider';
import SearchBar from './SearchBar';
import DropdownMenu from './DropdownMenu';

const getClassName = (path) => {
  const location = useLocation();
  const baseStyle =
    'inline-flex items-center justify-center px-4 py-2 whitespace-no-wrap focus:outline-none focus:shadow-none';
  const isActive = location.pathname === path;

  return `${baseStyle} ${
    isActive
      ? 'underline underline-offset-8 text-themeNavy font-bold hover:decoration-double'
      : 'text-themeNavy hover:underline underline-offset-8'
  }`;
};

function NavButtonsUser() {
  const { handleLogOut } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown menu when component is unmounted
  useEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, []);

  // close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className='text-right flex flex-col md:flex-row justify-end relative items-center'>
      <div className='order-2 md:order-1 flex-grow-1'>
        <div className='flex justify-center sm:justify-start items-center md:order-1'>
          <SearchBar className='ml-0 sm:ml-2' />
        </div>
      </div>
      <div className='flex'>
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={getClassName('/user-dashboard')}
        >
          My Account
        </button>
        {isOpen && (
          <div ref={dropdownRef} className='absolute left-0 right-0 top-full mt-2 w-48'>
            <DropdownMenu setIsOpen={setIsOpen} />
          </div>
        )}

        <NavLink to='/user-playlists' className={getClassName('/user-playlists')}>
          My Playlists
        </NavLink>
        <NavLink to='/playlist' className={getClassName('/playlist')}>
          All Playlists
        </NavLink>
        <NavLink to='/' className={getClassName('/')} onClick={handleLogOut}>
          Log Out
        </NavLink>
      </div>
    </div>
  );
}

function NavButtonsNoUser() {
  return (
    <div className='text-right flex flex-col md:flex-row justify-end relative items-center'>
      <div className='order-2 md:order-1 flex-grow-1'>
        <div className='flex justify-center sm:justify-start items-center md:order-1'>
          <SearchBar className='ml-0 sm:ml-2' />
        </div>
      </div>
      <div className='flex'>
        <NavLink to='/playlist' className={getClassName('/playlist')}>
          Browse Playlists
        </NavLink>
        <NavLink to='/login' className={getClassName('/login')}>
          Log In
        </NavLink>
        <NavLink to='/register' className={getClassName('/register')}>
          Register
        </NavLink>
      </div>
    </div>
  );
}

export { NavButtonsUser, NavButtonsNoUser };
