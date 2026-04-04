import app from './app.js';
import db from './config/db.js';

const PORT = process.env.PORT || 5000;

// Test DB connection before starting server
db.getConnection()
  .then((connection) => {
    console.log('✅ Database connected successfully');
    connection.release();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
