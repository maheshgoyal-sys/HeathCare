const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});
const { notFound, errorHandler } = require('./middleware/ErrorHandler');
// ... routes yahan aayenge
app.use(notFound);
app.use(errorHandler);

module.exports = app;