const router = require('express').Router();
const c = require('../controllers/patientController');
const auth = require('../middleware/Auth');
const authorize = require('../middleware/Authorize');
const validate = require('../middleware/Validate');
const { idParam } = require('../validators/common');
const { patientRules } = require('../validators/patientValidator');

router.use(auth); 

router.get('/me', authorize('patient'), c.getMine);
router.put('/me', authorize('patient'), patientRules(true), validate, c.updateMine);
router.get('/assigned-to-me', authorize('doctor'), c.getAssignedToMe);
router.post('/', authorize('other'), patientRules(), validate, c.create);
router.get('/', authorize('other'), c.getAll);
router.get('/:id', authorize('other'), idParam(), validate, c.getOne);
router.put('/:id', authorize('other'), idParam(), patientRules(true), validate, c.update);
router.delete('/:id', authorize('other'), idParam(), validate, c.remove);

module.exports = router;