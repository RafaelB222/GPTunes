import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import Playlist from '../models/Playlist.js'
import bcrypt from 'bcrypt'
import Comment from '../models/Comments.js'
import PlaylistItem from '../models/PlaylistItem.js'

// get user if logged in
export const getCurrentUser = async (req, res) => {
  const id = req.user.id
  try {
    await User.findById(id).then((user) => {
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'User not found.' })
      }
      return res.status(StatusCodes.OK).json(user)
    })
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* DELETE USER */
export const deleteUser = async (req, res) => {
  const id = req.user.id
  try {
    if (id) {
      await Comment.deleteMany({ author: id })
      const playlists = await Playlist.find({ user: id })

      await Promise.all(
        playlists.map(async (playlist) => {
          await PlaylistItem.deleteMany({ playlist: playlist._id })
        })
      )

      await Playlist.deleteMany({ user: id })
      await User.findByIdAndDelete(id)
      return res
        .status(StatusCodes.OK)
        .json({ message: 'User deleted successfully.' })
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'You are not authorized to delete this user.',
      })
    }
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* GET USER USING PATH PARAMS */
export const searchUserId = async (req, res) => {
  const { id } = req.params
  try {
    await User.findById(id).then((user) => {
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'User not found.' })
      }
      return res.status(StatusCodes.OK).json(user)
    })
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* FOLLOW/UNFOLLOW */
export const followUser = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id


  try {
    if (id) {
      await User.findById(userId).then((user) => {
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'User not found.' })
        }
        if (user.following.includes(id)) {
          user.following.pull(id)
          user.save()
          return res
            .status(StatusCodes.OK)
            .json({ message: 'Unfollowed user.' })
        } else {
          user.following.push(id)
          user.save()
          return res.status(StatusCodes.OK).json({ message: 'Followed user.' })
        }
      })
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'You are not authorized to follow this user.',
      })
    }
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* GET ALL USERS */
export const getAllUsers = async (req, res) => {
  try {
    // return all users including their first_name, last_name, and location and playlists sort by last created
    const users = await Playlist.find()
      .populate('user', 'first_name last_name location')
      .sort({ createdAt: -1 })
    return res.status(StatusCodes.OK).json(users)
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* GET USERS */
export const getUserList = async (req, res) => {
  try {
    const users = await User.find()
    return res.status(StatusCodes.OK).json(users)
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error })
  }
}

/* GET FOLLOWING */
export const getFollowing = async (req, res) => {
  const id = req.user.id

  try {
    const user = await User.findById(id).populate(
      'following',
      '_id first_name last_name image_url'
    )
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User not found.' })
    }
    return res.status(StatusCodes.OK).json(user.following)
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/*GET FOLLOWING PLAYLISTS */
export const getFollowingPlaylists = async (req, res) => {
  const userId = req.user.id

  try {
    const playlists = await Playlist.find().populate('user')

    const followingPlaylists = []
    await User.findById(userId).then((user) => {
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'User not found.' })
      }

      playlists.forEach((playlist) => {
        if (user.following.includes(playlist.user._id.toString())) {
          followingPlaylists.push(playlist)
        }
      })
      return res.status(StatusCodes.OK).json(followingPlaylists)
    })
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* GET USER PLAYLISTS */
export const getUserPlaylists = async (req, res) => {
  const id = req.user.id

  try {
    const playlists = await Playlist.find({ user: id })
      .populate('user', 'first_name last_name location')
      .populate('songs', 'title artist album genre')

    res.status(200).json(playlists)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* GET FOLLOWERS */
export const getFollowers = async (req, res) => {
  const userId = req.user.id

  try {
    const users = await User.find()
    const followers = []
    users.forEach((user) => {
      if (user._id !== userId && user.following.includes(userId)) {
        followers.push(user)
      }
    })
    return res.status(StatusCodes.OK).json(followers)
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* GET LIKED PLAYLISTS */
export const getLikedPlaylists = async (req, res) => {
  const userId = req.user.id

  try {
    const playlists = await Playlist.find()
    const likedPlaylists = []
    for (let i = 0; i < playlists.length; i++) {
      if (playlists[i].likes.includes(userId)) {
        const playlist = await playlists[i].populate(
          'user',
          'first_name last_name location _id'
        )
        likedPlaylists.push(playlist)
      }
    }
    return res.status(StatusCodes.OK).json(likedPlaylists)
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* GET USER TOP GENRES */

export const getUserTopGenres = async (req, res) => {
  const userId = req.user.id

  try {
    const playlists = await Playlist.find().populate('songs')
    const likedPlaylistSongs = []
    playlists.forEach((playlist) => {
      if (playlist.likes.includes(userId)) {
        playlist.songs.forEach((song) => {
          likedPlaylistSongs.push({
            id: song._id,
            genre: song.genre,
          })
        })
      }
    })

    const genres = {}

    for (const song of likedPlaylistSongs) {
      if (!genres[song.genre]) {
        genres[song.genre] = 0
      }
      genres[song.genre]++
    }

    const sortedGenres = Object.keys(genres).sort(
      (a, b) => genres[b] - genres[a]
    )

    return res.status(StatusCodes.OK).json(sortedGenres.slice(0, 5))
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* ADD SPOTIFY TOKEN TO DB */
export const addSpotifyToken = async (req, res) => {
  const userId = req.user.id
  const token = req.body.token
  
  try {
    await User.findByIdAndUpdate(
      userId,
      { spotify_access_token: token },
      { new: true }
    )
    return res.status(StatusCodes.OK).json(token)
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

export const verifyPassword = async (req, res) => {
  const { password } = req.body
  const userId = req.user.id

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (isPasswordCorrect) {
      res.status(200).json({ message: 'Password is correct' })
    } else {
      res.status(401).json({ error: 'Incorrect password' })
    }
  } catch (error) {
    console.error('Error verifying password:', error)
    res.status(500).json({ error: 'An error occurred. Please try again.' })
  }
}
