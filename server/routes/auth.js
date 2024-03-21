import express from 'express'
import multer from 'multer'
import { v4 as uuid } from 'uuid'
import { verifyToken } from '../middleware/verifyToken.js'
import { login, register, editAccount } from '../controllers/auth.js'

// /* MULTER SETUP */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images')
  },
  filename: (req, file, cb) => {
    const newFileName = file.originalname + uuid()
    cb(null, newFileName)
  },
})

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
    }
  },
})

const authRoutes = (app) => {
  const router = express.Router()

  router.post('/login', login(app))
  router.post('/register', upload.single('image'), register)
  router.patch('/update', upload.single('image'), verifyToken, editAccount)

  return router
}

export default authRoutes
