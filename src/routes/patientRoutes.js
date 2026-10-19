const router = require('express').Router();
const c = require('../controllers/patientController');
const auth = require('../middleware/Auth');
const validate = require('../middleware/Validate');
const { idParam } = require('../validators/common');
const { patientRules } = require('../validators/patientValidator');

router.use(auth); 

router.post('/', patientRules(), validate, c.create);
router.get('/', c.getAll);
router.get('/:id', idParam(), validate, c.getOne);
router.put('/:id', idParam(), patientRules(true), validate, c.update);
router.delete('/:id', idParam(), validate, c.remove);

module.exports = router;