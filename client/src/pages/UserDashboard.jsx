import DefaultLayout from '../components/layout/DefaultLayout';
import DashBoardMain from '../components/dashboard/DashboardMain';
import PlaylistSummary from '../components/dashboard/PlaylistSummary';
import FollowingList from '../components/dashboard/FollowingList';
import FollowersList from '../components/dashboard/FollowersList';
import LikedPlaylists from '../components/dashboard/LikedPlaylists';

export default function UserDashboard() {
  return (
    <DefaultLayout pageTitle={'Dashboard'}>
      <div className='max-w-full mx-auto px-4 py-8 md:w-4/5'>
        <DashBoardMain />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 l'>
          <div className='col-span-1 row-span-1'>
            <PlaylistSummary />
          </div>
          <div className='col-span-1 row-span-1'>
            <LikedPlaylists />
          </div>
          <div className='col-span-1 row-span-1'>
            <FollowingList />
          </div>
          <div className='col-span-1 row-span-1'>
            <FollowersList />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
