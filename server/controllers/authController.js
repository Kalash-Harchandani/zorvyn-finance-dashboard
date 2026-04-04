import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Role from '../models/Role.js';
import db from '../config/db.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

// @desc    Register a new user & create a new Organization
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, organizationName } = req.body;

  if (!username || !email || !password || !organizationName) {
    return next(new AppError('Please provide username, email, password and organization name', 400));
  }

  // Check if user exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return next(new AppError('User already exists', 400));
  }

  // Find Super Admin role for the first user of a tenant
  const superAdminRole = await Role.findByName('Super Admin');
  if (!superAdminRole) {
    return next(new AppError('Roles not initialized. Please run init-db.', 500));
  }

  // Create a new Tenant (Organization)
  const [tenantResult] = await db.query(
    'INSERT INTO tenants (name) VALUES (?)',
    [organizationName]
  );
  const tenantId = tenantResult.insertId;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  // Create User as Super Admin for the new tenant
  const userId = await User.create({
    username,
    email,
    password_hash,
    role_id: superAdminRole.id,
    tenant_id: tenantId
  });

  if (userId) {
    res.status(201).json({
      status: 'success',
      data: {
        id: userId,
        username,
        email,
        role: 'Super Admin',
        organization: organizationName,
        token: generateToken(userId, tenantId),
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
        tenant_id: user.tenant_id,
        token: generateToken(user.id, user.tenant_id),
      }
    });
  } else {
    return next(new AppError('Invalid email or password', 401));
  }
});

// @desc    Add a team member to the current tenant
// @route   POST /api/v1/auth/team
// @access  Private (Admin/SuperAdmin)
export const createTeamMember = asyncHandler(async (req, res, next) => {
  const { username, email, password, roleName } = req.body;

  if (!username || !email || !password || !roleName) {
    return next(new AppError('Please provide username, email, password and role', 400));
  }

  // Check if role is valid for team member (don't allow creating more Super Admins via this route)
  const allowedRoles = ['Accountant', 'Auditor', 'Viewer', 'Admin'];
  if (!allowedRoles.includes(roleName)) {
    return next(new AppError('Invalid role for team member', 400));
  }

  // Check if user exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return next(new AppError('User already exists', 400));
  }

  const role = await Role.findByName(roleName);
  if (!role) {
    return next(new AppError('Role not found', 404));
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  // Create User within the SAME tenant as the requester
  const userId = await User.create({
    username,
    email,
    password_hash,
    role_id: role.id,
    tenant_id: req.user.tenant_id
  });

  res.status(201).json({
    status: 'success',
    message: `Team member ${username} created successfully as ${roleName}`,
    data: { id: userId, username, email, role: roleName }
  });
});

// @desc    Get all team members for the current tenant
// @route   GET /api/v1/auth/team
// @access  Private (Admin/Auditor)
export const getTeamMembers = asyncHandler(async (req, res, next) => {
  const [rows] = await db.query(
    `SELECT u.id, u.username, u.email, u.created_at, r.name as role_name 
     FROM users u
     LEFT JOIN roles r ON u.role_id = r.id
     WHERE u.tenant_id = ?`,
    [req.user.tenant_id]
  );

  res.json({
    status: 'success',
    data: rows
  });
});
