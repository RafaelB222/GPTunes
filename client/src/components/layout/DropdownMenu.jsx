import { NavLink } from 'react-router-dom';

const DropdownMenu = ({ setIsOpen }) => {
  return (
    <div className='w-48 text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
      <NavLink
        to='/user-dashboard'
        className='relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-themeMidBlue focus:z-10 focus:ring-2 focus:ring-themeMidBlue focus:text-themeMidBlue dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white hover:rounded'
        onClick={() => setIsOpen(false)}
      >
        <svg
          aria-hidden='true'
          className='w-4 h-4 mr-2 fill-current'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z'
            clipRule='evenodd'
          ></path>
        </svg>
        Dashboard
      </NavLink>
      <NavLink
        to='/user-settings'
        className='relative hover:rounded inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-themeMidBlue focus:z-10 focus:ring-2 focus:ring-themeMidBlue focus:text-themeMidBlue dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white'
        onClick={() => setIsOpen(false)}
      >
        <svg
          aria-hidden='true'
          className='w-4 h-4 mr-2 fill-current'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z'></path>
        </svg>
        Settings
      </NavLink>
    </div>
  );
};

export default DropdownMenu;
