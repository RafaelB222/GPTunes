import express from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import {
  getCurrentUser,
  searchUserId,
  deleteUser,
  followUser,
  getUserPlaylists,
  getFollowers,
  getFollowing,
  getLikedPlaylists,
  getUserTopGenres,
  addSpotifyToken,
  verifyPassword,
  getUserList,
  getFollowingPlaylists,
} from '../controllers/user.js'

const router = express.Router()

// routes for user
router.get('/current', verifyToken, getCurrentUser)
router.get('/search/:id', verifyToken, searchUserId)
router.delete('/delete', verifyToken, deleteUser)
router.put('/follow/:id', verifyToken, followUser)
router.get('/following/:id', verifyToken, getFollowing)
router.get('/following-playlists', verifyToken, getFollowingPlaylists)
router.get('/followers', verifyToken, getFollowers)
router.get('/likes', verifyToken, getLikedPlaylists)
router.get('/genres', verifyToken, getUserTopGenres)
router.post('/send-token', verifyToken, addSpotifyToken)
router.post('/verify-password', verifyToken, verifyPassword)
router.get('/playlist/:id', verifyToken, getUserPlaylists)
router.get('/', getUserList)

export default router
