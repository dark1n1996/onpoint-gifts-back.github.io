const { Router } = require('express');

const router = Router();
const user = require('./users');
const donation = require('./donations');
const gift = require('./gifts');
const pageNotExist = require('./page-not-exist');

router.use(user);
router.use(donation);
router.use(gift);
router.use(pageNotExist);

module.exports = router;
