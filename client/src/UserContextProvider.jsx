import React, { useContext, useState } from 'react';
import { useGet } from './hooks/useGet';
import { AppContext } from './AppContextProvider';
import axios from 'axios';

const UserContext = React.createContext({});

function UserContextProvider({ children }) {
  const { user, users, usersLoading, auth, BASE_URL } = useContext(AppContext);
  const [accessToken, setAccessToken] = useState('');
  const [profileFollowers, setProfileFollowers] = useState([]);

  const { data: userPlaylists, refresh: refreshUserPlaylists } = useGet(
    `${BASE_URL}/user/playlist/${user?._id}`,
    [],
    auth,
  );

  const { data: following, refresh: refreshFollowing } = useGet(
    `${BASE_URL}/user/following/${user?._id}`,
    [],
    auth,
  );

  const { data: followers, refresh: refreshFollowers } = useGet(
    `${BASE_URL}/user/followers`,
    [],
    auth,
  );

  const { data: followingPlaylists, refresh: refreshFollowingPlaylists } = useGet(
    `${BASE_URL}/user/following-playlists`,
    [],
    auth,
  );

  const { data: likes, refresh: refreshLikes } = useGet(`${BASE_URL}/user/likes`, [], auth);

  const followUnfollow = async (user) => {
    try {
      await axios.put(
        `${BASE_URL}/user/follow/${user._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${auth}` },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const likeUnlike = async (playlist) => {
    try {
      await axios.put(
        `${BASE_URL}/playlist/like/${playlist.playlist._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${auth}` },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  function fetchUserFollowers(profile) {
    profileFollowers.splice(0, profileFollowers.length);
    if (profile && !usersLoading && users) {
      for (const u of users) {
        if (u.following.includes(profile._id)) {
          profileFollowers.push(u);
        }
      }
    }
    setProfileFollowers(profileFollowers);
  }

  const userContext = {
    followers,
    followUnfollow,
    likeUnlike,
    following,
    likes,
    userPlaylists,
    refreshUserPlaylists,
    refreshFollowing,
    refreshFollowers,
    refreshLikes,
    accessToken,
    setAccessToken,
    followingPlaylists,
    refreshFollowingPlaylists,
    fetchUserFollowers,
    profileFollowers,
    setProfileFollowers,
  };

  return <UserContext.Provider value={userContext}>{children}</UserContext.Provider>;
}

export { UserContext, UserContextProvider };
