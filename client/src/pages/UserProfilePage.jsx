import DefaultLayout from '../components/layout/DefaultLayout';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../AppContextProvider';
import ProfileSummary from '../components/user-components/ProfileSummary';
import ProfilePlaylists from '../components/user-components/ProfilePlaylists';
import LoadingPartial from '../components/reusables/LoadingPartial';
import { useParams } from 'react-router-dom';
import { useInterval } from '../hooks/useInterval';
import { UserContext } from '../UserContextProvider';

export default function UserProfilePage() {
  const { users, userProfilePlaylists, navigate } = useContext(AppContext);
  const { fetchUserFollowers } = useContext(UserContext);
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const maxIntervalCount = 3;
  let [intervalCount, setIntervalCount] = useState(0);

  useInterval(() => {
    const foundProfile = users.find((a) => a._id === id);
    if (foundProfile) {
      setProfile(foundProfile);
      userProfilePlaylists(foundProfile);
      fetchUserFollowers(foundProfile);
      setIntervalCount(null);
    } else {
      setIntervalCount(intervalCount + 1);
    }
    if (intervalCount == maxIntervalCount) {
      navigate('/profileNotFound');
    }
  }, 1000);

  if (!profile) {
    return <LoadingPartial />;
  }

  return (
    <DefaultLayout>
      <ProfileSummary profile={profile} />
      <ProfilePlaylists profile={profile} />
    </DefaultLayout>
  );
}
