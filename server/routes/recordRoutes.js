import express from 'express';
import { 
  createRecord, 
  getRecords, 
  updateRecord, 
  deleteRecord,
  getDashboardSummary
} from '../controllers/recordController.js';
import { requireAuth, checkPermissions } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/dashboard', checkPermissions(['read:dashboard']), getDashboardSummary);

router.route('/')
  .get(checkPermissions(['read:records']), getRecords)
  .post(checkPermissions(['create:records']), createRecord);

router.route('/:id')
  .put(checkPermissions(['update:records']), updateRecord)
  .delete(checkPermissions(['delete:records']), deleteRecord);

export default router;
