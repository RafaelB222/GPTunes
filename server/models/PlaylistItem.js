import mongoose from 'mongoose'
const Schema = mongoose.Schema

const PlaylistItemSchema = new Schema({
  playlist: {
    type: Schema.Types.ObjectId,
    ref: 'Playlist',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  released: {
    type: Date,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
})

const PlaylistItem = mongoose.model('PlaylistItem', PlaylistItemSchema)
export default PlaylistItem
