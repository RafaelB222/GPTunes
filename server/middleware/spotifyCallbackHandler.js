// @ts-check
import { getToken } from './spotifyTokenHandler.js'
import getUserSpotifyId from './getUserSpotifyId.js'
import User from '../models/User.js'

async function handleSpotifyCallback(req, res) {
  const code = req.query.code
  const state = req.query.state

  if (typeof code !== 'string' || typeof state !== 'string') {
    res.status(400).json({
      error: 'No authorization code',
    })
    return
  }

  const { userId } = JSON.parse(decodeURI(state))

  try {
    const tokenResponse = await getToken(code)

    const accessToken = tokenResponse?.data.access_token
    const refreshToken = tokenResponse?.data.refresh_token
    const expiresIn = parseInt(tokenResponse?.data.expires_in)
    const accessTokenExpiryTime = isNaN(expiresIn) ? 3600000 : expiresIn * 1000

    const userSpotifyId = await getUserSpotifyId(accessToken)

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          spotify_refresh_token: refreshToken,
          spotify_Id: userSpotifyId,
        },
      }
    )

    const updatedUser = await User.findById(userId)

    req.session.user = updatedUser

    res.cookie('spotifyAccessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: accessTokenExpiryTime, // expires in an hour
    })

    console.log({
      accessToken,
      refreshToken,
      userId,
      userSpotifyId,
    })

    res.redirect(
      `http://localhost:5173/user-settings?userId=${userId}&accessToken=${accessToken}`
    )
  } catch (error) {
    console.error('Error getting access token.', error)
    res.status(400).json({
      error: 'Error getting access token.',
    })
  }
}

export default handleSpotifyCallback
