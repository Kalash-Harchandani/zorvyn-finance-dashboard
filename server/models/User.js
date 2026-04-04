import db from '../config/db.js';

class User {
  static async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT u.*, r.name as role_name, t.name as organization_name 
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id 
       LEFT JOIN tenants t ON u.tenant_id = t.id
       WHERE u.email = ?`, 
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT u.*, r.name as role_name, t.name as organization_name 
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id 
       LEFT JOIN tenants t ON u.tenant_id = t.id
       WHERE u.id = ?`, 
      [id]
    );
    return rows[0];
  }

  static async create(userData) {
    const { username, email, password_hash, role_id, tenant_id } = userData;
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash, role_id, tenant_id) VALUES (?, ?, ?, ?, ?)',
      [username, email, password_hash, role_id, tenant_id]
    );
    return result.insertId;
  }
}

export default User;
