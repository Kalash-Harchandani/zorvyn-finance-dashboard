import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });

const seedData = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Connected to MySQL for seeding');

    const [users] = await connection.query('SELECT id FROM users WHERE username = ?', ['superadmin']);
    if (users.length === 0) {
      console.error('❌ Superadmin user not found. Please run init-db first.');
      process.exit(1);
    }
    const adminId = users[0].id;

    const records = [
      [5000.00, 'income', 'Salary', '2024-03-01', 'Monthly paycheck', adminId],
      [1200.00, 'expense', 'Rent', '2024-03-02', 'Apartment rent', adminId],
      [150.50, 'expense', 'Groceries', '2024-03-05', 'Weekly shopping', adminId],
      [200.00, 'income', 'Freelance', '2024-03-10', 'Web design project', adminId],
      [60.00, 'expense', 'Utilities', '2024-03-12', 'Electricity bill', adminId],
      [45.00, 'expense', 'Dining', '2024-03-15', 'Dinner with friends', adminId],
      [1000.00, 'income', 'Bonus', '2024-03-20', 'Performance bonus', adminId],
      [80.00, 'expense', 'Transport', '2024-03-22', 'Fuel and parking', adminId],
    ];

    console.log('🌱 Seeding financial records...');
    for (const record of records) {
      await connection.query(
        'INSERT INTO financial_records (amount, type, category, date, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        record
      );
    }

    console.log('✅ Sample data seeded successfully!');
    await connection.end();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
