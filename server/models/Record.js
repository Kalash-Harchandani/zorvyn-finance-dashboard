import db from '../config/db.js';

class Record {
  static async create(recordData) {
    const { amount, type, category, date, notes, created_by, tenant_id } = recordData;
    const [result] = await db.query(
      `INSERT INTO financial_records (amount, type, category, date, notes, created_by, tenant_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [amount, type, category, date, notes, created_by, tenant_id]
    );
    return result.insertId;
  }

  static async findById(id, tenant_id) {
    const [rows] = await db.query(
      `SELECT * FROM financial_records WHERE id = ? AND tenant_id = ? AND deleted_at IS NULL`,
      [id, tenant_id]
    );
    return rows[0];
  }

  static async update(id, tenant_id, updates) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) return true;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    values.push(id, tenant_id); 

    const [result] = await db.query(
      `UPDATE financial_records SET ${setClause} WHERE id = ? AND tenant_id = ? AND deleted_at IS NULL`,
      values
    );

    return result.affectedRows > 0;
  }

  static async softDelete(id, tenant_id) {
    const [result] = await db.query(
      `UPDATE financial_records SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?`,
      [id, tenant_id]
    );
    return result.affectedRows > 0;
  }

  static async getAll(tenant_id, filters = {}, options = { limit: 20, offset: 0 }) {
    let query = `SELECT r.*, u.username as creator_name 
                 FROM financial_records r
                 LEFT JOIN users u ON r.created_by = u.id
                 WHERE r.tenant_id = ? AND r.deleted_at IS NULL`;
    const params = [tenant_id];

    if (filters.type) {
      query += ` AND r.type = ?`;
      params.push(filters.type);
    }
    if (filters.category) {
      query += ` AND r.category LIKE ?`;
      params.push(`%${filters.category}%`);
    }
    if (filters.noteSearch) {
      query += ` AND r.notes LIKE ?`;
      params.push(`%${filters.noteSearch}%`);
    }
    if (filters.startDate) {
      query += ` AND r.date >= ?`;
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ` AND r.date <= ?`;
      params.push(filters.endDate);
    }

    query += ` ORDER BY r.date DESC LIMIT ? OFFSET ?`;
    params.push(Number(options.limit), Number(options.offset));

    const [rows] = await db.query(query, params);
    
    // Total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM financial_records r WHERE r.tenant_id = ? AND r.deleted_at IS NULL`;
    const countParams = [tenant_id];
    if (filters.type) { countQuery += ` AND r.type = ?`; countParams.push(filters.type); }
    if (filters.category) { countQuery += ` AND r.category LIKE ?`; countParams.push(`%${filters.category}%`); }
    if (filters.noteSearch) { countQuery += ` AND r.notes LIKE ?`; countParams.push(`%${filters.noteSearch}%`); }
    if (filters.startDate) { countQuery += ` AND r.date >= ?`; countParams.push(filters.startDate); }
    if (filters.endDate) { countQuery += ` AND r.date <= ?`; countParams.push(filters.endDate); }
    
    const [countRows] = await db.query(countQuery, countParams);
    
    return { data: rows, total: countRows[0].total };
  }

  // Dashboard Aggregations
  static async getSummary(tenant_id, filters = {}) {
    let query = `
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
      FROM financial_records
      WHERE tenant_id = ? AND deleted_at IS NULL
    `;
    const params = [tenant_id];

    if (filters.category) { query += ` AND category LIKE ?`; params.push(`%${filters.category}%`); }
    if (filters.search) { query += ` AND notes LIKE ?`; params.push(`%${filters.search}%`); }
    if (filters.startDate) { query += ` AND date >= ?`; params.push(filters.startDate); }
    if (filters.endDate) { query += ` AND date <= ?`; params.push(filters.endDate); }

    const [rows] = await db.query(query, params);
    
    const income = rows[0].total_income || 0;
    const expense = rows[0].total_expense || 0;
    return {
      total_income: Number(income),
      total_expense: Number(expense),
      net_balance: Number(income) - Number(expense)
    };
  }

  static async getCategoryTotals(tenant_id, filters = {}) {
    let query = `
      SELECT category, type, SUM(amount) as total
      FROM financial_records
      WHERE tenant_id = ? AND deleted_at IS NULL
    `;
    const params = [tenant_id];

    if (filters.category) { query += ` AND category LIKE ?`; params.push(`%${filters.category}%`); }
    if (filters.search) { query += ` AND notes LIKE ?`; params.push(`%${filters.search}%`); }
    if (filters.startDate) { query += ` AND date >= ?`; params.push(filters.startDate); }
    if (filters.endDate) { query += ` AND date <= ?`; params.push(filters.endDate); }

    query += ` GROUP BY category, type`;

    const [rows] = await db.query(query, params);
    return rows;
  }
}

export default Record;
