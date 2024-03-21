import axios from 'axios'

export default async function getUserSpotifyId(accessToken) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const userId = response.data.id

    return userId
  } catch (error) {
    console.error(
      'Error getting spotify id:',
      error.response ? error.response.data : error
    )
  }
}
