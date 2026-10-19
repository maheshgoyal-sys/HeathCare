const router = require('express').Router();
const c = require('../controllers/MappingController');
const auth = require('../middleware/Auth');
const authorize = require('../middleware/Authorize');
const validate = require('../middleware/Validate');
const { idParam } = require('../validators/common');
const { createMappingRules } = require('../validators/MappingValidator');

router.use(auth);

router.post('/', authorize('other'), createMappingRules, validate, c.create);
router.get('/', authorize('other'), c.getAll);
router.get('/:patient_id', authorize('other'), idParam('patient_id'), validate, c.getByPatient);
router.delete('/:id', authorize('other'), idParam(), validate, c.remove);

module.exports = router;