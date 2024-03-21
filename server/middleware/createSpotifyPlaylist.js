import axios from 'axios'
import refreshSpotifyToken from './spotifyTokenHandler.js'

export const exportPlaylistToSpotify = async (req, res) => {
  try {
    const accessToken = req.accessToken

    const userSpotifyId = req.session.user.spotify_Id

    await createPlaylist(userSpotifyId, accessToken, req.body)
    res.status(200).json({ message: 'Playlist created successfully' })
  } catch (error) {
    if (error.message === 'Access token expired') {
      const tokenResponse = await refreshSpotifyToken(req.session.user)
      const accessToken = tokenResponse?.accessToken

      const accessTokenExpiryTime = tokenResponse?.expires_in * 1000

      res.cookie('spotifyAccessToken', accessToken, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: accessTokenExpiryTime / 1000,
      })
      const userSpotifyId = req.session.user.spotify_Id
      await createPlaylist(userSpotifyId, accessToken, req.body)
      res.status(200).json({ message: 'Playlist created successfully' })
    } else {
      console.error(`Error creating playlist in backend`, error.message)
    }
  }
}

async function createPlaylist(userSpotifyId, accessToken, playlistInfo) {
  try {
    const playlistName = playlistInfo.playlistName
    const description = playlistInfo.playlistDescription
    const isPublic = playlistInfo.isPublic
    // the tracks object must be an array of objects containing a name and an artist name.
    const tracks = playlistInfo.tracks

    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    const trackUris = await searchTracks(tracks, accessToken)

    // create the playlist using the spotify API. Again this assumes that the access token is part of the request header.
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userSpotifyId}/playlists`,
      {
        name: playlistName,
        description: description,
        public: isPublic,
      }
    )

    const playlistId = response.data.id

    // add tracks to the create playlist.
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: trackUris,
      }
    )
  } catch (error) {
    if (
      error.response.status === 401 &&
      error.response.data.error.message === 'The access token expired'
    ) {
      throw new Error('Access token expired')
    } else {
      console.error(`Error creating playlist in backend`, error.message)
    }
  }
}

async function searchTracks(tracks, accessToken) {
  //use the search track to search for each track uri and create a new array populated by the track uris.
  const trackUris = await Promise.all(
    tracks.map(({ name, artist }) => searchTrack(name, artist, accessToken))
  )
  //filter out any null values
  return trackUris.filter((uri) => uri !== null)
}

async function searchTrack(name, artistName, accessToken) {
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    //search the spotify api for a track using the name and artist
    const searchQuery = `${name} artist:${artistName}`
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: searchQuery,
        type: 'track',
        limit: 1,
      },
    })

    if (response.data.tracks.items.length === 0) {
      throw new Error(`No results found for "${name}" by "${artistName}"`)
    }

    const trackUri = response.data.tracks.items[0].uri
    return trackUri
  } catch (error) {
    console.error(
      `Error searching for "${name}" by "${artistName}": ${error.message}`
    )
    return null
  }
}
