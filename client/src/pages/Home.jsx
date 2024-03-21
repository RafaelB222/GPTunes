import DefaultLayout from '../components/layout/DefaultLayout';
import { useContext } from 'react';
import { AppContext } from '../AppContextProvider';
import AllPlaylistsFeed from '../components/playlist-components/AllPlaylistsFeed';
import { PinkButton } from '../components/reusables/NewButtons';

export default function Home() {
  const { user, navigate } = useContext(AppContext);

  const handleNewPlaylistClick = () => {
    if (user === null) {
      navigate('/login');
    } else {
      navigate('/create-playlist');
    }
  };

  return (
    <>
      <DefaultLayout>
        <div className='w-full'>
          <div className='text-themeNavy bg-themePalePink'>
            <h2 className='text-themeMidPink text-3xl text-center mr-2'>
              playlists for every moment
            </h2>
            <p className='p-6 text-center'>
              Tired of endlessly scrolling through music apps trying to find the perfect playlist?
              Our app takes care of the hard work for you. Simply provide a prompt - a song, artist,
              genre, or mood - and our algorithm will generate a custom playlist tailored to your
              tastes.
            </p>
          </div>
          <div className='text-center'>
            <PinkButton
              buttonText={user === null ? 'Login to create a playlist!' : 'Create a Playlist'}
              action={handleNewPlaylistClick}
            />
          </div>
          <AllPlaylistsFeed />
        </div>
      </DefaultLayout>
    </>
  );
}
