import express from 'express'
import {
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getPlaylists,
  likePlaylist,
  isPromptUnderstandable,
  getComments,
  addComment,
  deleteComment,
  getPlaylistByUserId,
} from '../controllers/playlist.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/create', verifyToken, createPlaylist)
router.delete('/delete/:id', verifyToken, deletePlaylist)
router.get('/:id', getPlaylistById)
router.get('/', getPlaylists)
router.get('/user-playlists/:id', verifyToken, getPlaylistByUserId)
router.put('/like/:id', verifyToken, likePlaylist)
router.post('/understandable', verifyToken, isPromptUnderstandable)
router.get('/comments/:id', verifyToken, getComments)
router.post('/comments/:id', verifyToken, addComment)
router.delete('/comments/:id', verifyToken, deleteComment)

export default router
