import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import User from '../models/User.js';
import db from '../config/db.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      req.user = user;
      next();
    } catch (error) {
      return next(new AppError('Not authorized, token failed', 401));
    }
  }

  if (!token) {
    return next(new AppError('Not authorized, no token', 401));
  }
});

export const checkPermissions = (requiredPermissions) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.role_id) {
      return next(new AppError('Not authorized', 403));
    }

    // Super Admin overrides everything
    if (req.user.role_name === 'Super Admin') {
      return next();
    }

    // Fetch permissions mapped to this user's role
    const [rows] = await db.query(
      `SELECT p.action 
       FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       WHERE rp.role_id = ?`,
      [req.user.role_id]
    );

    const userPermissions = rows.map(row => row.action);

    // Verify if user has AT LEAST ONE of the required permissions
    const hasPermission = requiredPermissions.some((perm) => userPermissions.includes(perm));

    if (!hasPermission) {
      return next(new AppError(`Forbidden: Missing required permissions for this action`, 403));
    }

    next();
  });
};
