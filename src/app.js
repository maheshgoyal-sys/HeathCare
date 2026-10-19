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

app.use('/api/auth', require('./routes/AuthRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/DoctorRoutes'));
app.use('/api/mappings', require('./routes/MappingRoutes'));
app.use(notFound);
app.use(errorHandler);
module.exports = app;