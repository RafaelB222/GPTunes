import { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../AppContextProvider';
import { NavButtonsUser, NavButtonsNoUser } from './NavButtons';

export default function Header({ animated }) {
  const { user } = useContext(AppContext);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (animated === false) {
      setIsLoaded(false);
    } else {
      setIsLoaded(true);
    }
  }, []);

  function showNavButtons() {
    if (user) {
      return <NavButtonsUser />;
    } else {
      return <NavButtonsNoUser />;
    }
  }

  return (
    <>
      <div className='text-center p-4 pr-0 flex flex-col md:flex-row justify-between items-center font-light text-l bg-themePalePink'>
        <div className='text-left text-bgray-700 font-bold text-3xl py-1 px-4'>
          <NavLink to='/'>
            <h1 className='font-light text-themeNavy'>
              <strong>GPT</strong>unes
            </h1>
          </NavLink>
        </div>
        <div className='line-container flex justify-end pb-2 sm:hidden'>
          <div className={`border-b-2 border-themeNavy ${isLoaded ? 'animated' : ''}`}></div>
        </div>
        <div className='flex flex-col md:flex-row sm:pr-4 '>{showNavButtons()}</div>
      </div>
      <div className='line-container hidden justify-end pb-2 sm:flex'>
        <div className={`border-b-2 border-themeNavy ${isLoaded ? 'animated' : ''}`}></div>
      </div>
    </>
  );
}
