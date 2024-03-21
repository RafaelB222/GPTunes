import DefaultLayout from '../components/layout/DefaultLayout';
import { useContext } from 'react';
import { AppContext } from '../AppContextProvider';
import PlaylistFeedItem from '../components/playlist-components/PlaylistFeedItem';
import UserListItem from '../components/user-components/UserListItem';

export default function SearchResultsPage() {
  const { searchResults, navigate } = useContext(AppContext);

  if (!searchResults) {
    navigate('/');
  } else {
    const resultUsers = searchResults.data?.users;
    const resultPlaylists = searchResults.data?.playlists;

    return (
      <>
        <DefaultLayout bgColour={'#1a2744'}>
          <div className='w-3/4 mx-auto'>
            <h1 className='text-3xl text-themePalePink text-center sm:text-4xl mb-8'>
              Search results
            </h1>
            <div className='text-themePalePink'>
              {resultUsers?.length != 0 ? (
                <div className='p-4'>
                  <h2 className='text-xl'>Users found: </h2>
                  <ul className='feedList text-center divide-y divide-themePalePink'>
                    {resultUsers?.map((user, index) => (
                      <UserListItem user={user} colourNum={(index % 3) + 1} key={user._id} />
                    ))}
                  </ul>
                </div>
              ) : (
                <div className='text-center p-4'>
                  <p>No users matching that search were found.</p>
                </div>
              )}
              {resultPlaylists?.length != 0 ? (
                <div className='p-4'>
                  <h2 className='text-xl'>Playlists found: </h2>
                  <ul className='feedList divide-y divide-themePalePink'>
                    {resultPlaylists?.map((playlist, index) => (
                      <PlaylistFeedItem
                        playlist={playlist}
                        key={playlist._id}
                        colourNum={(index % 3) + 1}
                      />
                    ))}
                  </ul>
                </div>
              ) : (
                <div className='text-center p-4'>
                  <p>No playlists matching that search were found.</p>
                </div>
              )}
            </div>
          </div>
        </DefaultLayout>
      </>
    );
  }
}
