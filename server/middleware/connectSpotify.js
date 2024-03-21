import dotenv from 'dotenv'

dotenv.config()

const clientId = process.env.SPOTIFY_CLIENT_ID

function connectSpotify(req, res) {
  const scope =
    'streaming \
               user-read-email \
               user-read-private \
               playlist-modify-private'

  const state = JSON.stringify({ userId: req.user.id })

  const auth_query_parameters = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: 'http://localhost:3001/api/callback',
    state,
  })

  res.json({
    redirect_location: `https://accounts.spotify.com/authorize/?${auth_query_parameters}`,
  })
}

export default connectSpotify
