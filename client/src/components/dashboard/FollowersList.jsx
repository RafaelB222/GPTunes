import { useContext } from 'react';
import { UserContext } from '../../UserContextProvider';
import UserListItem from '../user-components/UserListItem';

export default function FollowersList() {
  const { followers } = useContext(UserContext);

  return (
    <div className='dashboardItem rounded-lg shadow-md p-6 flex flex-col'>
      <h2 className='text-2xl text-themeNavy mb-4'>Followers:</h2>
      {followers.length === 0 ? (
        <p className='text-themeMidPink text-center'>No followers yet...</p>
      ) : (
        <ul className=''>
          {followers.map((follower, index) => (
            <UserListItem user={follower} key={follower._id} colourNum={(index % 3) + 1} />
          ))}
        </ul>
      )}
    </div>
  );
}
