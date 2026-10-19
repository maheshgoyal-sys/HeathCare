const router = require('express').Router();
const { register } = require('../controllers/AuthController');
const { registerRules } = require('../validators/AuthValidator');
const validate = require('../middleware/Validate');

router.post('/register', registerRules, validate, register);
const { register, login } = require('../controllers/AuthController');
const { registerRules, loginRules } = require('../validators/AuthValidator');
router.post('/login', loginRules, validate, login);
module.exports = router;