import express from 'express'
import handleSpotifyCallback from '../middleware/spotifyCallbackHandler.js'
import { checkForMissingToken } from '../middleware/spotifyTokenHandler.js'
import connectSpotify from '../middleware/connectSpotify.js'
import { search } from '../controllers/search.js'
import { exportPlaylistToSpotify } from '../middleware/createSpotifyPlaylist.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { getRandomPrompt } from '../middleware/generate.js'
import { validateSession } from '../middleware/sessionValidator.js'

const router = express.Router()
// for any api routes

router.get('/connectSpotify', verifyToken, connectSpotify)

router.get('/callback', handleSpotifyCallback)

router.post(
  '/createSpotifyPlaylist',
  validateSession,
  checkForMissingToken,
  exportPlaylistToSpotify
)

router.get('/search', search)

router.get('/getRandomPrompt', verifyToken, getRandomPrompt)

export default router
