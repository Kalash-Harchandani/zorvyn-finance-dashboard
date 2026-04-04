import Record from '../models/Record.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import db from '../config/db.js';

// Helper to create an audit log
const createAuditLog = async (userId, tenantId, action, targetTable, targetId, details) => {
  await db.query(
    `INSERT INTO audit_logs (user_id, tenant_id, action_type, target_table, target_id, details) VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, tenantId, action, targetTable, targetId, JSON.stringify(details)]
  );
};

// @desc    Create a new record
// @route   POST /api/v1/records
export const createRecord = asyncHandler(async (req, res, next) => {
  const { amount, type, category, date, notes } = req.body;

  if (!amount || !type || !category || !date) {
    return next(new AppError('Please provide amount, type, category, and date', 400));
  }

  const recordId = await Record.create({
    amount,
    type,
    category,
    date,
    notes,
    created_by: req.user.id,
    tenant_id: req.user.tenant_id
  });

  await createAuditLog(req.user.id, req.user.tenant_id, 'CREATE', 'financial_records', recordId, { amount, type, category, date, notes });

  res.status(201).json({
    status: 'success',
    data: { id: recordId, amount, type, category, date, notes }
  });
});

// @desc    Get all records with pagination and filters
// @route   GET /api/v1/records
export const getRecords = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const filters = {
    type: req.query.type,
    category: req.query.category,
    noteSearch: req.query.search
  };

  const { data, total } = await Record.getAll(req.user.tenant_id, filters, { limit, offset });

  res.json({
    status: 'success',
    results: data.length,
    total,
    page,
    limit,
    data
  });
});

// @desc    Update a record
// @route   PUT /api/v1/records/:id
export const updateRecord = asyncHandler(async (req, res, next) => {
  const record = await Record.findById(req.params.id, req.user.tenant_id);

  if (!record) {
    return next(new AppError('Record not found', 404));
  }

  const updates = { ...req.body };
  await Record.update(req.params.id, req.user.tenant_id, updates);

  await createAuditLog(req.user.id, req.user.tenant_id, 'UPDATE', 'financial_records', req.params.id, updates);

  const updatedRecord = await Record.findById(req.params.id, req.user.tenant_id);

  res.json({
    status: 'success',
    data: updatedRecord
  });
});

// @desc    Delete a record (Soft Delete)
// @route   DELETE /api/v1/records/:id
export const deleteRecord = asyncHandler(async (req, res, next) => {
  const record = await Record.findById(req.params.id, req.user.tenant_id);

  if (!record) {
    return next(new AppError('Record not found', 404));
  }

  await Record.softDelete(req.params.id, req.user.tenant_id);
  await createAuditLog(req.user.id, req.user.tenant_id, 'DELETE', 'financial_records', req.params.id, { deleted: true });

  res.json({
    status: 'success',
    message: 'Record deleted successfully'
  });
});

// @desc    Get dashboard summary
// @route   GET /api/v1/records/dashboard
export const getDashboardSummary = asyncHandler(async (req, res, next) => {
  const summary = await Record.getSummary(req.user.tenant_id);
  const categoryTotals = await Record.getCategoryTotals(req.user.tenant_id);

  res.json({
    status: 'success',
    data: {
      summary,
      categoryTotals
    }
  });
});

// @desc    Get audit logs
// @route   GET /api/v1/records/audit-logs
export const getAuditLogs = asyncHandler(async (req, res, next) => {
  const [rows] = await db.query(`
    SELECT a.*, u.username 
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.tenant_id = ?
    ORDER BY a.timestamp DESC
    LIMIT 50
  `, [req.user.tenant_id]);

  res.json({
    status: 'success',
    data: rows
  });
});
