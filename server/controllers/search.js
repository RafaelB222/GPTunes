import Playlist from '../models/Playlist.js'
import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'

export const search = async (req, res) => {
  const query = req.query.query

  try {
    const users = await User.find({
      $or: [
        { first_name: { $regex: query, $options: 'i' } },
        { last_name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ],
    })
    const playlists = await Playlist.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    }).populate('user', 'first_name last_name location')
    const results = { users, playlists }

    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    })
  }
}
