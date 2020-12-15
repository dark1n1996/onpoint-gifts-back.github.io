const { Router } = require('express');

const router = Router();
const pageNotExist = require('../middlewars/page-not-exist');

router.use('*', pageNotExist);

module.exports = router;
