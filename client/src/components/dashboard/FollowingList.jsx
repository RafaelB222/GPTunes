import { useContext } from 'react';
import { UserContext } from '../../UserContextProvider';
import { DarkLinkButton } from '../reusables/NewButtons';
import { AppContext } from '../../AppContextProvider';
import UserListItem from '../user-components/UserListItem';

export default function FollowingList() {
  const { following } = useContext(UserContext);
  const { navigate } = useContext(AppContext);

  const handleFollowingPlaylistsClick = () => {
    navigate('/playlist/following');
  };

  return (
    <div className='dashboardItem rounded-lg shadow-md p-6 flex flex-col'>
      <h2 className='text-2xl text-themeNavy mb-4'>Following:</h2>
      {following.length === 0 ? (
        <p className='text-themeMidPink text-center'>You&apos;re not following anyone yet.</p>
      ) : (
        <>
          <ul className='flex-1'>
            {following.map((following, index) => (
              <UserListItem user={following} key={following._id} colourNum={(index % 3) + 1} />
            ))}
          </ul>
          <DarkLinkButton
            buttonText={'View Following Playlists'}
            action={handleFollowingPlaylistsClick}
          />
        </>
      )}
    </div>
  );
}