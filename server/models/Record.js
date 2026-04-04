import db from '../config/db.js';

class Record {
  static async create(recordData) {
    const { amount, type, category, date, notes, created_by } = recordData;
    const [result] = await db.query(
      `INSERT INTO financial_records (amount, type, category, date, notes, created_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [amount, type, category, date, notes, created_by]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT * FROM financial_records WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );
    return rows[0];
  }

  static async update(id, updates) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) return true;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    values.push(id); 

    const [result] = await db.query(
      `UPDATE financial_records SET ${setClause} WHERE id = ? AND deleted_at IS NULL`,
      values
    );

    return result.affectedRows > 0;
  }

  static async softDelete(id) {
    const [result] = await db.query(
      `UPDATE financial_records SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getAll(filters = {}, options = { limit: 20, offset: 0 }) {
    let query = `SELECT r.*, u.username as creator_name 
                 FROM financial_records r
                 LEFT JOIN users u ON r.created_by = u.id
                 WHERE r.deleted_at IS NULL`;
    const params = [];

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

    query += ` ORDER BY r.date DESC LIMIT ? OFFSET ?`;
    params.push(Number(options.limit), Number(options.offset));

    const [rows] = await db.query(query, params);
    
    // Total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM financial_records r WHERE r.deleted_at IS NULL`;
    const countParams = [];
    if (filters.type) { countQuery += ` AND r.type = ?`; countParams.push(filters.type); }
    if (filters.category) { countQuery += ` AND r.category LIKE ?`; countParams.push(`%${filters.category}%`); }
    if (filters.noteSearch) { countQuery += ` AND r.notes LIKE ?`; countParams.push(`%${filters.noteSearch}%`); }
    
    const [countRows] = await db.query(countQuery, countParams);
    
    return { data: rows, total: countRows[0].total };
  }

  // Dashboard Aggregations
  static async getSummary() {
    const [rows] = await db.query(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
      FROM financial_records
      WHERE deleted_at IS NULL
    `);
    
    const income = rows[0].total_income || 0;
    const expense = rows[0].total_expense || 0;
    return {
      total_income: Number(income),
      total_expense: Number(expense),
      net_balance: Number(income) - Number(expense)
    };
  }

  static async getCategoryTotals() {
    const [rows] = await db.query(`
      SELECT category, type, SUM(amount) as total
      FROM financial_records
      WHERE deleted_at IS NULL
      GROUP BY category, type
    `);
    return rows;
  }
}

export default Record;
