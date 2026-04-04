import db from '../config/db.js';

class User {
  static async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT users.*, roles.name as role_name 
       FROM users 
       LEFT JOIN roles ON users.role_id = roles.id 
       WHERE email = ?`, 
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT users.*, roles.name as role_name 
       FROM users 
       LEFT JOIN roles ON users.role_id = roles.id 
       WHERE users.id = ?`, 
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
