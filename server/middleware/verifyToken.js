import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

/* VERIFY JWT ACCESS TOKEN */
// you can use this middleware whenever you require a user to be logged in to perform an action
// for example: router.post("/playlist", verifyToken, createPlaylist) -- A user has to be logged in to create a playlist
export const verifyToken = (req, res, next) => {
  try {
    let token = req.header('Authorization')

    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'No token provided.' })
    }

    if (token.startsWith('Bearer')) {
      token = token.slice(7, token.length).trimLeft()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    res.locals.user = decoded
    next()
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}
