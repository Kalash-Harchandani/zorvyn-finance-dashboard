import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const initDb = async () => {
  try {
    // Connect without database to create it first if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('✅ Connected to MySQL Server');

    // Create Database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`✅ Database ${process.env.DB_NAME} ready`);

    // Switch to the created database
    await connection.query(`USE \`${process.env.DB_NAME}\`;`);

    // Create Roles Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        description VARCHAR(255)
      );
    `);

    // Create Permissions Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        action VARCHAR(100) UNIQUE NOT NULL,
        description VARCHAR(255)
      );
    `);

    // Create Role_Permissions Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      );
    `);

    // Create Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
      );
    `);

    // Create Financial Records Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS financial_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        amount DECIMAL(15, 2) NOT NULL,
        type ENUM('income', 'expense') NOT NULL,
        category VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        notes TEXT,
        created_by INT,
        deleted_at TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Create Audit Logs Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action_type VARCHAR(100) NOT NULL,
        target_table VARCHAR(100) NOT NULL,
        target_id INT NOT NULL,
        details JSON,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);
    
    console.log('✅ Tables created successfully');

    // Insert Default Roles if they don't exist
    const roles = [
      ['Viewer', 'Read-only dashboard access'],
      ['Analyst', 'Read financial data + access analytics'],
      ['Accountant', 'Create and update financial records. Cannot manage users'],
      ['Auditor', 'Read-only access to all records + audit logs. No write permissions'],
      ['Manager', 'Access summaries, trends, and Insights. No raw data modification'],
      ['Admin', 'Full access to records and users'],
      ['Super Admin', 'Full system-level control']
    ];

    for (const role of roles) {
      await connection.query('INSERT IGNORE INTO roles (name, description) VALUES (?, ?)', role);
    }
    console.log('✅ Default roles seeded');

    // Also Insert a Super Admin User
    const [superAdminRole] = await connection.query('SELECT id FROM roles WHERE name = ?', ['Super Admin']);
    
    if (superAdminRole.length > 0) {
      const superAdminId = superAdminRole[0].id;
      const hashedPassword = await bcrypt.hash('superadmin123', 10);
      await connection.query(
        'INSERT IGNORE INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)', 
        ['superadmin', 'superadmin@zorvyn.com', hashedPassword, superAdminId]
      );
      console.log('✅ Default superadmin user seeded (superadmin / superadmin123)');
    }

    await connection.end();
    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
};

initDb();
