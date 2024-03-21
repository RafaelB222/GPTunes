import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const UserSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      min: 3,
      max: 30,
    },
    last_name: {
      type: String,
      required: true,
      min: 3,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    location: {
      type: String,
      required: true,
      default: '',
    },
    spotify_refresh_token: {
      type: String,
      default: '',
    },
    spotify_Id: {
      type: String,
      default: '',
    },
    image_url: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

const User = mongoose.model('User', UserSchema)
export default User
