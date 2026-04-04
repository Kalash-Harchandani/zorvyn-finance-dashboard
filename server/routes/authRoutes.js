import express from 'express';
import { registerUser, loginUser, createTeamMember, getTeamMembers } from '../controllers/authController.js';
import { requireAuth, checkPermissions } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/team', requireAuth, checkPermissions(['read:dashboard']), getTeamMembers);
router.post('/team', requireAuth, checkPermissions(['manage:team']), createTeamMember);

export default router;
