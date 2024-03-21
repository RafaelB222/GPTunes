import { useState, useContext, useEffect } from 'react';
import DefaultLayout from '../components/layout/DefaultLayout';
import { EditAccountForm } from '../components/forms/EditAccountForm';
import { BlueButton, PinkButton, SpotifyButton } from '../components/reusables/NewButtons';
import axios from '../util/axiosConfig';
import { AppContext } from '../AppContextProvider';
import { UserContext } from '../UserContextProvider';
import Modal from '../components/reusables/Modal';

const UserSettingsPage = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const { user, BASE_URL, auth, navigate, setAuth, setUser, refreshUsers, refreshPlaylists } = useContext(AppContext);
  const { refreshLikes, refreshFollowing, refreshFollowers } = useContext(UserContext);
  const { accessToken, setAccessToken } = useContext(UserContext);
  const [userConnectedToSpotify, setUserConnectedToSpotify] = useState(false);

  const deleteAccount = async () => {
    try {
      await axios.delete(`${BASE_URL}/user/delete`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth}`,
        },
      });
      refreshUsers();
      refreshPlaylists();
      refreshLikes();
      refreshFollowing();
      refreshFollowers();

      navigate('/login');
      setAuth(null);
      setUser(null);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleEditProfileClick = () => {
    setShowEditForm(true);
  };

  const handleDeleteAccountConfirm = async (password) => {
    try {
      const verifyResponse = await axios.post(
        `${BASE_URL}/user/verify-password`,
        {
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth}`,
          },
        },
      );

      if (verifyResponse.status === 200) {
        await deleteAccount();
      } else {
        alert('Incorrect password');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleDeleteAccountClick = () => {
    setShowConfirmDeleteModal(true);
  };

  const handleConnectSpotifyClick = () => {
    axios
      .get(`${BASE_URL}/api/connectSpotify`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth}`,
        },
      })
      .then((res) => {
        const { accessToken } = res.data;
        const redirectUrl = new URL(res.data.redirect_location);
        redirectUrl.searchParams.set('accessToken', accessToken);
        window.location.href = redirectUrl.toString();
      })

      .catch((error) => {
        console.error(error);
      });
  };

  const spotifyConnected = () => {
    if (user.spotify_refresh_token || accessToken) {
      setUserConnectedToSpotify(true);
    } else {
      setUserConnectedToSpotify(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessTokenFromUrl = urlParams.get('accessToken');
    if (accessTokenFromUrl && accessTokenFromUrl !== accessToken) {
      setAccessToken(accessTokenFromUrl);
    }
    spotifyConnected();
  }, [accessToken]);

  const handleSaveChanges = async (updatedInfo) => {
    try {
      await axios.patch(`${BASE_URL}/user/update`, updatedInfo, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth}`,
        },
      });
    } catch (error) {
      console.error('Error updating account:', error);
    } finally {
      setShowEditForm(false);
    }
  };

  return (
    <DefaultLayout pageTitle={'Account settings'}>
      <div className='max-w-screen-xl w-full mx-auto p-6'>
        <div className='button-container flex flex-col md:flex-row md:justify-evenly mb-6 space-y-4 md:space-y-0 md:space-x-4'>
          <BlueButton
            className='w-full md:w-auto'
            buttonText='Edit Profile'
            action={handleEditProfileClick}
          />
          <SpotifyButton
            className='w-full md:w-auto'
            buttonText={userConnectedToSpotify ? 'Connected' : 'Connect to Spotify'}
            action={handleConnectSpotifyClick}
            trueState={userConnectedToSpotify}
          />
          <PinkButton
            className='w-full md:w-auto'
            buttonText='Delete Account'
            action={handleDeleteAccountClick}
          />
        </div>
        {showEditForm && (
          <div className='bg-gray-100 p-4 rounded shadow mt-4 sm:max-w-md sm:mx-auto'>
            <EditAccountForm onSave={handleSaveChanges} closeForm={() => setShowEditForm(false)} />
          </div>
        )}
      </div>
      {showConfirmDeleteModal && (
        <Modal
          title='Confirm Delete Account'
          onCancel={() => setShowConfirmDeleteModal(false)}
          onConfirm={handleDeleteAccountConfirm}
          showPasswordInput
        />
      )}
    </DefaultLayout>
  );
};

export default UserSettingsPage;
