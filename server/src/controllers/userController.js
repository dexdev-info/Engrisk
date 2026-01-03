import User from '../models/User.js'
import ErrorResponse from '../utils/errorResponse.js'

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      'name email role avatar enrolledCourses currentStreak totalPoints'
    )
    // FE hien thi ten Course ngay
    // .populate('enrolledCourses', 'title slug')
    if (!user) {
      return next(new ErrorResponse('User not found', 404))
    }

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      avatar: req.body.avatar
    }

    // Tìm và update, trả về data mới (new: true)
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}
