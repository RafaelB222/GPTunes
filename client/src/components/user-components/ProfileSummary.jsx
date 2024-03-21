import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../AppContextProvider';
import { UserContext } from '../../UserContextProvider';
import { OrangeButton, BlueButton } from '../reusables/NewButtons';

/**
 * Displays a summary of a User's profile. Displayed in the top half of a UserProfilePage.
 * Shows their number of followers and following, allows other users to follow/unfollow from here.
 * Takes in the profile currently being viewed.
 */
export default function ProfileSummary({ profile }) {
  const { navigate, IMAGE_URL, user, refreshUsers } = useContext(AppContext);
  const { following, followUnfollow, refreshFollowing, profileFollowers, refreshFollowers } =
    useContext(UserContext);

  const [follow, setFollow] = useState(false);
  const [followCount, setFollowCount] = useState(profileFollowers.length);

  useEffect(() => {
    if (user) {
      for (let i = 0; i < following.length; i++) {
        const currentFollowing = following[i]._id;
        if (currentFollowing === profile._id) {
          setFollow(true);
        }
      }
    }
  }, [following]);

  const handleFollowClicked = async () => {
    await followUnfollow(profile);
    toggleFollow();
    refreshFollowing();
    refreshFollowers();
    refreshUsers();
  };

  const toggleFollow = () => {
    let updateFollowCount;
    if (follow === false) {
      updateFollowCount = followCount + 1;
    } else if (follow === true) {
      updateFollowCount = followCount - 1;
    }

    setFollow(!follow);
    setFollowCount(updateFollowCount);
  };

  //when a user is viewing their own profile, they cannot follow themselves
  const handleEditAccountClick = () => {
    navigate('/user-settings');
  };

  //the current user is not logged in
  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <div className='dashboardItem rounded-lg p-6 mb-4'>
        <div className='flex flex-row justify-evenly'>
          <div className='profileHeader flex flex-col items-center text-center'>
            <img
              src={IMAGE_URL + profile.image_url}
              className='profileImageSmall'
              alt={`Profile Picture`}
            />
            <h1 className='text-3xl text-themeNavy mb-4'>
              {profile.first_name} {profile.last_name}
            </h1>
            <h3>
              <strong>{profile.following.length}</strong> following
            </h3>
            <h3>
              <strong>{followCount}</strong> followers
            </h3>

            {user && profile._id !== user._id ? (
              <OrangeButton
                buttonText={follow ? 'Unfollow?' : 'Follow'}
                action={handleFollowClicked}
                name='Follow'
              />
            ) : (
              <>
                {user && profile._id === user._id ? (
                  <OrangeButton buttonText={'Edit your account'} action={handleEditAccountClick} />
                ) : (
                  <BlueButton buttonText={'Login to follow'} action={goToLogin} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
