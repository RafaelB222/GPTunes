import axios from './axiosConfig';

export const exportPlaylistToSpotify = async (playlist, BASE_URL, user) => {
  try {
    const tracks = playlist.songs.map((item) => {
      return {
        name: item.title,
        artist: item.artist,
      };
    });  

    const response = await axios.post(`${BASE_URL}/api/createSpotifyPlaylist`, {
      playlistName: playlist.title,
      playlistDescription: playlist.description,
      isPublic: false,
      tracks: tracks,
      user: user,
    });

    
    window.alert(response.data.message);

  
  } catch (error) {
    console.error('Error creating playlist:', error.message);
  }
};
