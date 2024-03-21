import { useState, useEffect, useContext } from 'react';
import unlike from '../../assets/icons/unlike.png';
import liked from '../../assets/icons/liked.png';
import { UserContext } from '../../UserContextProvider';

/**
 * Creates a LikeButton that is used to like (and unlike) Playlists. Handles log in navigation
 * for users who are not logged in and are attempting to like a Playlist. Also counts the number
 * of likes belonging to a Playlist.
 */
export function LikeButton({ playlist, user, refreshPlaylists }) {
  const { likeUnlike, refreshLikes, refreshUserPlaylists } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(playlist.likes.length);

  useEffect(() => {
    if (user && playlist.likes.includes(user._id)) {
      setIsLiked(true);
    }
  }, [user]);

  const handleLikeClicked = () => {
    toggleLiked();
    likeUnlike({ playlist: playlist });
    refreshLikes();
    refreshPlaylists();
    refreshUserPlaylists();
  };

  const toggleLiked = () => {
    setIsLiked(!isLiked);
    let newLikeCount;
    if (!isLiked) {
      newLikeCount = likeCount + 1;
    } else {
      newLikeCount = likeCount - 1;
    }
    setLikeCount(newLikeCount);
  };

  return (
    <button
      onClick={handleLikeClicked}
      className='flex flex-row self-start justify-self-end pt-4'
    >
      {likeCount}
      <img src={isLiked ? unlike : liked} className='likeIcon' alt='heart shape' />
    </button>
  );
}

export function LikeButtonNoUser({ playlist, navigate }) {
  const likeCount = playlist.likes.length;
  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <button
      onClick={goToLogin}
      className='text-themeMidPink flex flex-row font-bold pt-4'
    >
      {likeCount}
      <img src={liked} className='likeIcon' alt='heart shape' />
    </button>
  );
}
