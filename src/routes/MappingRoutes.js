const router = require('express').Router();
const c = require('../controllers/MappingController');
const auth = require('../middleware/Auth');
const validate = require('../middleware/Validate');
const { idParam } = require('../validators/common');
const { createMappingRules } = require('../validators/MappingValidator');

router.use(auth);

router.post('/', createMappingRules, validate, c.create);
router.get('/', c.getAll);
router.get('/:patient_id', idParam('patient_id'), validate, c.getByPatient);
router.delete('/:id', idParam(), validate, c.remove);

module.exports = router;