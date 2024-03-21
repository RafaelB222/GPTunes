import Playlist from '../models/Playlist.js'
import PlaylistItem from '../models/PlaylistItem.js'
import { generate, generateImage } from '../middleware/generate.js'
import { StatusCodes } from 'http-status-codes'
import nlp from 'compromise'
import sw from 'stopword'
import checkWord from 'check-word'
import Comment from '../models/Comments.js'
import { getWeatherDescription } from '../middleware/weather.js'

export const createPlaylist = async (req, res) => {
  try {
    const id = req.user.id
    let { prompt } = req.body
    const { addImage, userLocation, addWeather } = req.body

    if (!id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'You need to be logged in to perform this action.',
      })
    }

    if (userLocation && addWeather) {
      const weatherDescription = await getWeatherDescription(userLocation)
      prompt += ' for a day with ' + weatherDescription
    }

    const playlistData = await generate(prompt)

    let newPlaylistData

    // generate AI image from Dall-e

    if (addImage) {
      const playlistImage = await generateImage(prompt, id)
      newPlaylistData = {
        user: id,
        title: playlistData.title,
        description: playlistData.description,
        playlist_image: playlistImage,
      }
    } else {
      newPlaylistData = {
        user: id,
        title: playlistData.title,
        description: playlistData.description,
      }
    }

    const newPlaylist = new Playlist(newPlaylistData)

    const savedPlaylist = await newPlaylist.save()

    const playlistItemIds = await addSongs(
      savedPlaylist._id,
      playlistData.songs
    )

    savedPlaylist.songs = playlistItemIds
    await savedPlaylist.save()

    const combinedPlaylist = await Playlist.findById(
      savedPlaylist._id
    ).populate('songs')

    res.status(StatusCodes.CREATED).json(combinedPlaylist)
  } catch (err) {
    console.error('Error in createPlaylist: ', err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    })
  }
}

const addSongs = async (id, songs) => {
  const playlistItemIds = []

  for (const song of songs) {
    const { title, artist, album, released, genre } = song

    const newSong = new PlaylistItem({
      playlist: id,
      title: title,
      artist: artist,
      album: album,
      released: released,
      genre: genre,
    })

    const savedSong = await newSong.save()

    playlistItemIds.push(savedSong._id)
  }

  return playlistItemIds
}

/* DELETE PLAYLIST */
export const deletePlaylist = async (req, res) => {
  const userId = req.user.id
  const { id } = req.params

  const playlistFound = await Playlist.findById(id)

  try {
    if (playlistFound.user == userId) {
      await PlaylistItem.deleteMany({ playlist: id }).then(() => {
        Playlist.findByIdAndDelete(id).then(() => {
          Comment.deleteMany({ playlist: id }).then(() => {
            res.status(StatusCodes.OK).json({
              message: 'Playlist deleted',
            })
          })
        })
      })
    } else {
      res.status(StatusCodes.FORBIDDEN).json({
        message: 'You do not have permission to delete this playlist',
      })
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* GET USER PLAYLISTS */
export const getUserPlaylists = async (req, res) => {
  const id = req.user.id

  try {
    const playlists = await Playlist.find({ user: id }).populate('songs')
    res.status(200).json(playlists)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* GET PLAYLIST BY ID*/
export const getPlaylistById = async (req, res) => {
  const { id } = req.params

  try {
    const playlist = await Playlist.findById(id)
      .populate('user', 'first_name last_name location')
      .populate('songs')
    res.status(StatusCodes.OK).json(playlist)
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* GET PLAYLIST BY USER ID */
export const getPlaylistByUserId = async (req, res) => {
  const { id } = req.params
  try {
    const playlists = await Playlist.find({ user: id })
      .populate('songs')
      .populate('user', 'first_name last_name location')
    res.status(200).json(playlists)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* UPDATE PLAYLIST */

/* GET ALL PLAYLISTS -- need to add pagination  */
export const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find()
      .populate('user', 'first_name last_name location')
      .populate('songs')
    res.status(StatusCodes.OK).json(playlists)
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* LIKE/UNLIKE */
export const likePlaylist = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    if (id) {
      await Playlist.findById(id).then((playlist) => {
        if (!playlist) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Playlist not found.' })
        }
        if (playlist.likes.includes(userId)) {
          playlist.likes.pull(userId)
          playlist.save()
          return res
            .status(StatusCodes.OK)
            .json({ message: 'Unliked playlist.' })
        } else {
          playlist.likes.push(userId)
          playlist.save()
          return res.status(StatusCodes.OK).json({ message: 'Liked playlist.' })
        }
      })
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'You are not authorized to like this playlist.',
      })
    }
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

export function isPromptUnderstandable(req, res) {
  const sentence = req.body.prompt
  const doc = nlp(sentence)
  const tokens = doc
    .text()
    .split(' ')
    .map((word) => word.toLowerCase())
  const cleanedTokens = sw.removeStopwords(tokens)

  // must have between 1 and 200 words
  if (tokens.length < 1 || tokens.length > 200) {
    return res.status(400).json({
      message: 'The prompt must be between 1 and 200 words',
      understandable: false,
    })
  }

  // check the proportion of words like "the", "a", "an"
  const stopwordRatio = cleanedTokens.length / tokens.length
  if (stopwordRatio < 0.1) {
    return res.status(400).json({
      message: 'Too many stopwords.',
      understandable: false,
    })
  }

  // check for ratio of English words, we need at least 50% so that the sentence is understandable to ChatGPT
  const words = checkWord('en')
  let englishWordCount = 0
  for (let i = 0; i < cleanedTokens.length; i++) {
    if (words.check(cleanedTokens[i])) {
      englishWordCount++
    } else {
      // remove non-English words from tokens
      const index = tokens.indexOf(cleanedTokens[i])
      if (index !== -1) {
        tokens.splice(index, 1)
      }
    }
  }

  const adjectiveCount = doc.adjectives().length
  const nounCount =
    doc.match('#Person').length +
    doc.match('#Place').length +
    doc.match('#Organization').length +
    doc.nouns().length
  const englishWordRatio = englishWordCount / cleanedTokens.length
  if (englishWordRatio < 0.5) {
    return res.status(400).json({
      message: 'Try using atleast one noun or adjective...',
      understandable: false,
    })
  }

  if (nounCount + adjectiveCount < 1) {
    res.status(400).json({
      message: 'Invalid prompt',
      understandable: false,
    })
  } else {
    res.status(200).json({ message: 'Valid prompt', understandable: true })
  }
}

/* GET COMMENTS */
export const getComments = async (req, res) => {
  const { id } = req.params

  try {
    const playlist = await Playlist.findById(id).populate({
      path: 'comments',
      select: 'content author createdAt',
      populate: {
        path: 'author',
        select: 'first_name last_name _id image_url',
      },
    })

    res.status(StatusCodes.OK).json(playlist.comments)
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

export const addComment = async (req, res) => {
  const { id } = req.params
  const { content } = req.body
  const userId = req.user.id

  try {
    const playlist = await Playlist.findById(id)
    const comment = new Comment({
      author: userId,
      content: content,
      playlist: id,
    })
    await comment.save()
    playlist.comments.push(comment._id)
    await playlist.save()
    res.status(StatusCodes.OK).json({
      message: 'Comment added.',
      _id: comment._id,
    })
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

export const deleteComment = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    const comment = await Comment.findById(id)
    if (comment.author.equals(userId)) {
      await comment.deleteOne().then(() => {
        Playlist.findById(comment.playlist).then((playlist) => {
          playlist.comments.pull(comment._id)
          playlist.save()
        })
      })

      res.status(StatusCodes.OK).json({ message: 'Comment deleted.' })
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'You are not authorized to delete this comment.',
      })
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}
