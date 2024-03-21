import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppContextProvider';
import { UserContext } from '../../UserContextProvider';
import { BlueButton, OrangeButton, PinkButton } from '../reusables/NewButtons';

export default function DashBoardMain() {
  const { user, navigate, IMAGE_URL } = useContext(AppContext);
  const { likes, userPlaylists } = useContext(UserContext);
  const [totalLikes, setTotalLikes] = useState(likes.length);

  const getTotalLikes = () => {
    let likesSum = 0;
    userPlaylists.forEach((playlist) => {
      const likes = playlist.likes.length;
      likesSum += likes;
    });
    setTotalLikes(likesSum);
  };

  useEffect(() => {
    getTotalLikes();
  }, [userPlaylists]);

  const handleEditAccountClick = () => {
    navigate('/user-settings');
  };

  const handleNewPlaylistClick = () => {
    navigate('/create-playlist');
  };

  const handleAllPlaylistsClick = () => {
    navigate('/user-playlists');
  };

  return (
    <div className='dashboardItem rounded-lg p-6 mb-4'>
      <div className='flex flex-row justify-evenly'>
        <img
          src={IMAGE_URL + user.image_url}
          className='profileImage m-4'
          alt={`Profile Picture`}
        />

        <div className='flex flex-col justify-center items-left'>
          <h2 className='text-3xl text-themeNavy mb-4'>Hi {user.first_name}!</h2>
          <p className='text-themeNavy text-lg'>
            The playlists you&apos;ve created have a total of {totalLikes} likes!
          </p>
        </div>
      </div>
      <div className='flex flex-col p-4 justify-evenly align-middle sm:flex-row md:flex-row'>
        <BlueButton buttonText={'View your playlists'} action={handleAllPlaylistsClick} />
        <OrangeButton buttonText={'Edit your account'} action={handleEditAccountClick} />
        <PinkButton buttonText={'Create a new playlist'} action={handleNewPlaylistClick} />
      </div>
    </div>
  );
}
