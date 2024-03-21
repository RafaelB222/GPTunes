import axios from 'axios'
import dotenv from 'dotenv'

import queryString from 'query-string'

dotenv.config()

const clientId = process.env.SPOTIFY_CLIENT_ID
const spotifySecret = process.env.SPOTIFY_CLIENT_SECRET
const redirectUri = 'http://localhost:3001/api/callback'
const tokenEndpoint = 'https://accounts.spotify.com/api/token'

export const getToken = async (code) => {
  const base64Credentials = Buffer.from(
    `${clientId}:${spotifySecret}`
  ).toString('base64')

  try {
    const tokenResponse = await axios.post(
      tokenEndpoint,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    return tokenResponse
  } catch (error) {
    console.error('Error getting access token here', error)
  }
}

export default async function refreshSpotifyToken(user) {
  try {

    const refreshToken = user?.spotify_refresh_token

    if (!refreshToken) {
      return
    }
    const requestBody = queryString.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })

    const response = await axios.post(tokenEndpoint, requestBody, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${spotifySecret}`
        ).toString('base64')}`,
      },
    })

    const accessToken = response?.data.access_token
    const accessTokenExpiryTime = parseInt(response.data.expires_in) * 1000

    const tokenResponse = {
      accessToken: accessToken,
      expiresIn: accessTokenExpiryTime,
    }

    return tokenResponse
  } catch (error) {
    console.error('Error refreshing access token', error)
  }
}

export const checkForMissingToken = async (req, res, next) => {
  let accessToken = req.cookies.spotifyAccessToken

  if (accessToken == null) {
    const user = req.session.user
    const tokenResponse = await refreshSpotifyToken(user)
    accessToken = tokenResponse?.accessToken

    const accessTokenExpiryTime = tokenResponse.expiresIn

    res.cookie('spotifyAccessToken', accessToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: accessTokenExpiryTime,
    })
  }

  // Set the access token in the request object, so it can be used by the next middleware or route handler
  req.accessToken = accessToken
  next()
}
