import User from '../models/User.js'
import ErrorResponse from '../utils/errorResponse.js'

/**
 * @desc    Get current logged in user
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    // req.user đã được middleware 'protect' gán vào rồi
    // Nhưng để chắc chắn lấy data mới nhất, ta query lại DB (bỏ qua field password)
    const user = await User.findById(req.user.id)

    if (!user) {
      return next(new ErrorResponse('User not found', 404))
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        currentStreak: user.currentStreak,
        totalPoints: user.totalPoints
        // Thêm các field khác nếu cần hiển thị ở Dashboard
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
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
