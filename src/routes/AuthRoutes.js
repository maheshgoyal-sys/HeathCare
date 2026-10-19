const router = require('express').Router();
const { register } = require('../controllers/AuthController');
const { registerRules } = require('../validators/AuthValidator');
const validate = require('../middleware/Validate');

router.post('/register', registerRules, validate, register);

module.exports = router;