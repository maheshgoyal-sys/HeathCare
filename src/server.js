require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');
const migrate = require('./config/migrate');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET must be set');
    }

    await sequelize.authenticate();
    await sequelize.sync();
    await migrate();
    console.log('PostgreSQL connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to connect to database:', err.message);
    process.exit(1);
  }
})();