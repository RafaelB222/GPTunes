import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../AppContextProvider';
import PlaylistCard from '../playlist-components/PlaylistCard';
import { LightButton } from '../reusables/NewButtons';
import { useInterval } from '../../hooks/useInterval';
import LoadingComponent from '../reusables/LoadingComponent';
/**
 * Displays all of a Users Playlists using the PlaylistCards. This is displayed in the bottom
 * half of a UserProfilePage. Takes in the profile currently being viewed.
 */
export default function ProfilePlaylists({ profile }) {
  const { profilePlaylists, user } = useContext(AppContext);
  const [numPlaylists, setNumPlaylists] = useState(4);
  const [recentPlaylists, setRecentPlaylists] = useState([]);

  //sort a users playlists from latest creations
  const sortedPlaylists = profilePlaylists.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  useEffect(() => {
    if (sortedPlaylists) {
      setRecentPlaylists(sortedPlaylists.slice(0, numPlaylists));
    }
  }, [numPlaylists]);

  useInterval(() => {
    if (!recentPlaylists) {
      setRecentPlaylists(sortedPlaylists.slice(0, numPlaylists));
    }
  }, 1000);

  if (!recentPlaylists) {
    return <LoadingComponent />;
  }

  const loadAllPlaylists = () => {
    setNumPlaylists(profilePlaylists.length);
  };

  return (
    <div className='dashboardItem rounded-lg p-6 m-4 '>
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6'>
        {user?._id === profile._id ? (
          <h1 className='col-span-5 text-3xl text-themeNavy mb-4'>Your Playlists</h1>
        ) : (
          <h1 className='col-span-5 text-3xl text-themeNavy mb-4'>
            {profile.first_name}&apos;s Playlists
          </h1>
        )}
        {profilePlaylists.length > 4 ? (
          <LightButton buttonText='View all playlists' action={loadAllPlaylists} />
        ) : (
          <></>
        )}
      </div>
      <div className='profilePlaylists grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
        {recentPlaylists.length > 0 ? (
          <>
            {recentPlaylists.map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))}
          </>
        ) : (
          <p>This user has no playlists yet...</p>
        )}
      </div>
    </div>
  );
}
