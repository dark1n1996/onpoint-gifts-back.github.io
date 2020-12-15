const { Router } = require('express');

const router = Router();
const { Joi, celebrate } = require('celebrate');
const { readUser, createUser, login, updateUser, readAllUsers } = require('../controllers/users');
const auth = require('../middlewars/auth');

router.get('/users/me', auth, readUser);
router.get('/users/all', auth, readAllUsers);
router.patch('/users/me', auth, updateUser);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
    name: Joi.string().required(),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }).unknown(true),
}), login);

module.exports = router;
