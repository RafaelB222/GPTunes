import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import * as url from 'url'
import session from 'express-session'
import cookieParser from 'cookie-parser'

const logger = morgan('tiny')

import authRoutes from './routes/auth.js'
import playlistRoutes from './routes/playlist.js'
import apiRoutes from './routes/api.js'
import userRoutes from './routes/user.js'

/* IMPORTANT: Changed type: "module" in package.json, so you need to use imports instead of require. */

dotenv.config()

/* EXPRESS SETUP */
const app = express()
app.use(express.json())
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(logger)
app.use(cookieParser())

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5000
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  })
  .catch((error) => console.log(error.message))

/* SESSION SETUP */
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
)

/* ROUTES */
app.use('/auth', authRoutes(app))
app.use('/playlist', playlistRoutes)
app.use('/api', apiRoutes)
app.use('/user', userRoutes)

const dirname = url.fileURLToPath(new URL('.', import.meta.url))

/* MAKE IMAGE FOLDER AVAILABLE STATICALLY */
app.use('/public', express.static(path.join(dirname, 'public')))

app.get('/', (req, res) => {
  res.send('It works!')
})
