const { Router } = require('express');
const { Joi, celebrate } = require('celebrate');
const { makeDonat, getDonat } = require('../controllers/donation');
const auth = require('../middlewars/auth');

const router = Router();

router.get('/donats', auth, getDonat);
router.post('/donats', celebrate({
  body: Joi.object().keys({
  name: Joi.string().required(),
  competence: Joi.string().required(),
  comment: Joi.string().required(),
  }),
}), auth, makeDonat);

module.exports = router;
