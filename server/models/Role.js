import db from '../config/db.js';

class Role {
  static async findByName(name) {
    const [rows] = await db.query('SELECT * FROM roles WHERE name = ?', [name]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await db.query('SELECT id, name, description FROM roles');
    return rows;
  }
}

export default Role;
