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

    // Default Roles
    const rolesData = [
      ['Viewer', 'Read-only dashboard access'],
      ['Analyst', 'Read financial data + access analytics'],
      ['Accountant', 'Create and update financial records. Cannot manage users'],
      ['Auditor', 'Read-only access to all records + audit logs. No write permissions'],
      ['Manager', 'Access summaries, trends, and Insights. No raw data modification'],
      ['Admin', 'Full access to records and users'],
      ['Super Admin', 'Full system-level control']
    ];

    for (const role of rolesData) {
      await connection.query('INSERT IGNORE INTO roles (name, description) VALUES (?, ?)', role);
    }
    console.log('✅ Default roles seeded');

    // Default Permissions
    const permissionsData = [
      ['read:dashboard', 'Can view dashboard analytics'],
      ['read:records', 'Can read list and detail of records'],
      ['create:records', 'Can create new financial records'],
      ['update:records', 'Can update existing records'],
      ['delete:records', 'Can soft delete records'],
      ['read:audit_logs', 'Can view audit logs']
    ];

    for (const perm of permissionsData) {
      await connection.query('INSERT IGNORE INTO permissions (action, description) VALUES (?, ?)', perm);
    }
    console.log('✅ Default permissions seeded');

    // Map Permissions to Roles
    // Example Maps:
    // Viewer -> read:dashboard
    // Analyst -> read:dashboard, read:records
    // Accountant -> read:dashboard, read:records, create:records, update:records
    // Auditor -> read:dashboard, read:records, read:audit_logs
    // Manager -> read:dashboard, read:records
    // Admin -> read:dashboard, read:records, create:records, update:records, delete:records, read:audit_logs

    const mappings = {
      'Viewer': ['read:dashboard'],
      'Analyst': ['read:dashboard', 'read:records'],
      'Accountant': ['read:dashboard', 'read:records', 'create:records', 'update:records'],
      'Auditor': ['read:dashboard', 'read:records', 'read:audit_logs'],
      'Manager': ['read:dashboard', 'read:records'],
      'Admin': ['read:dashboard', 'read:records', 'create:records', 'update:records', 'delete:records', 'read:audit_logs']
    };

    for (const [roleName, actions] of Object.entries(mappings)) {
      const [r] = await connection.query('SELECT id FROM roles WHERE name = ?', [roleName]);
      if (r.length === 0) continue;
      
      const roleId = r[0].id;

      for (const action of actions) {
        const [p] = await connection.query('SELECT id FROM permissions WHERE action = ?', [action]);
        if (p.length > 0) {
           await connection.query('INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [roleId, p[0].id]);
        }
      }
    }
    console.log('✅ Role-Permission mappings seeded');

    // Also Insert a Super Admin User
    const rolesToSeed = ['Super Admin', 'Accountant', 'Auditor', 'Viewer'];
    const hashedPassword = await bcrypt.hash('password123', 10);

    for (const roleName of rolesToSeed) {
      const [role] = await connection.query('SELECT id FROM roles WHERE name = ?', [roleName]);
      if (role.length > 0) {
        const username = roleName.toLowerCase().replace(' ', '');
        await connection.query(
          'INSERT IGNORE INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)', 
          [username, `${username}@zorvyn.com`, hashedPassword, role[0].id]
        );
      }
    }
    
    console.log('✅ Test users seeded (Password for all: password123)');
    console.log('   - superadmin@zorvyn.com');
    console.log('   - accountant@zorvyn.com');
    console.log('   - auditor@zorvyn.com');
    console.log('   - viewer@zorvyn.com');

    await connection.end();
    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
};

initDb();
