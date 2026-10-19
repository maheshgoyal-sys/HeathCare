const router = require('express').Router();
const { register, login } = require('../controllers/AuthController');
const { registerRules, loginRules } = require('../validators/AuthValidator');
const validate = require('../middleware/Validate');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
module.exports = router;