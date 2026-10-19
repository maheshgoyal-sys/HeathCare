const router = require('express').Router();
const c = require('../controllers/DoctorController');
const auth = require('../middleware/Auth');
const validate = require('../middleware/Validate');
const { idParam } = require('../validators/common');
const { doctorRules } = require('../validators/DoctorValidator');

router.use(auth);

router.post('/', doctorRules(), validate, c.create);
router.get('/', c.getAll);
router.get('/:id', idParam(), validate, c.getOne);
router.put('/:id', idParam(), doctorRules(true), validate, c.update);
router.delete('/:id', idParam(), validate, c.remove);

module.exports = router;