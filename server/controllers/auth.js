import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'

/* REGISTER */
export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, location, following } =
      req.body

    let path
    if (req.file) {
      path = req.file.path
    } else {
      path = 'public/images/defaultUser.png'
    }

    /* HASH */
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    /* NEW USER */
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      location,
      following,
      image_url: path,
    })

    const savedUser = await newUser.save()

    res.status(StatusCodes.CREATED).json(savedUser)
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* LOGIN */
export const login = () => async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json('User not found.')
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(StatusCodes.FORBIDDEN).json('Incorrect password.')
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    const userObject = user.toObject()
    delete userObject.password

    req.session.user = user

    req.session.save((err) => {
      if (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err })
      }
      res.status(StatusCodes.OK).json({ user, accessToken })
    })
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}

/* EDIT ACCOUNT */

export const editAccount = async (req, res) => {
  try {
    const { first_name, last_name, location } = req.body

    const findId = { _id: req.user.id }

    let updatedInfo = null

    if (req.file) {
      const path = req.file.path

      updatedInfo = {
        first_name,
        last_name,
        location,
        image_url: path,
      }
    } else {
      updatedInfo = {
        first_name,
        last_name,
        location,
      }
    }

    const updatedUser = await User.findOneAndUpdate(findId, updatedInfo, {
      new: true,
    })

    res.status(StatusCodes.OK).json(updatedUser)
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}
