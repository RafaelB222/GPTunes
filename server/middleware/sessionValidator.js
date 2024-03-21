import User from '../models/User.js'

export const validateSession = async (req, res, next) => {
  try {
    const userDatabseId = req.body.user._id

    const user = await User.findById(userDatabseId)

    if (req.session.user === user) {
    } else {
      req.session.user = user
    }

    next()
  } catch (error) {
    console.error(`Error validating session`, error.message)
  }
}
