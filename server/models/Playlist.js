import mongoose, { Schema } from 'mongoose'

const PlaylistSchema = mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      type: String,
      min: 20,
    },
    title: {
      type: String,
      required: true,
      min: 5,
    },
    description: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'LikedByUser',
      },
    ],
    playlist_image: {
      type: String,
      default: '',
    },

    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PlaylistItem',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
)

const Playlist = mongoose.model('Playlist', PlaylistSchema)
export default Playlist
