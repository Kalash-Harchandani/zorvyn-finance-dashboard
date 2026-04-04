import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Role from '../models/Role.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new AppError('Please provide all required fields', 400));
  }

  // Check if user exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return next(new AppError('User already exists', 400));
  }

  // Find default role (Viewer)
  const viewerRole = await Role.findByName('Viewer');
  if (!viewerRole) {
    return next(new AppError('Default role not found. Please initialize DB', 500));
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  // Create User
  const userId = await User.create({
    username,
    email,
    password_hash,
    role_id: viewerRole.id
  });

  if (userId) {
    res.status(201).json({
      status: 'success',
      data: {
        id: userId,
        username,
        email,
        role: 'Viewer',
        token: generateToken(userId),
      }
    });
  } else {
    return next(new AppError('Failed to register user', 500));
  }
});

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findByEmail(email);

  if (user && (await bcrypt.compare(password, user.password_hash))) {
    res.json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role_name,
        token: generateToken(user.id),
      }
    });
  } else {
    return next(new AppError('Invalid email or password', 401));
  }
});
