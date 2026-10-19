const router = require('express').Router();
const c = require('../controllers/DoctorController');
const auth = require('../middleware/Auth');
const authorize = require('../middleware/Authorize');
const validate = require('../middleware/Validate');
const { idParam } = require('../validators/common');
const { doctorRules } = require('../validators/DoctorValidator');

router.use(auth);

router.get('/me', authorize('doctor'), c.getMine);
router.put('/me', authorize('doctor'), doctorRules(true), validate, c.updateMine);
router.get('/assigned-to-me', authorize('patient'), c.getAssignedToMe);
router.post('/', authorize('other'), doctorRules(), validate, c.create);
router.get('/', authorize('other'), c.getAll);
router.get('/:id', authorize('other'), idParam(), validate, c.getOne);
router.put('/:id', authorize('other'), idParam(), doctorRules(true), validate, c.update);
router.delete('/:id', authorize('other'), idParam(), validate, c.remove);

module.exports = router;