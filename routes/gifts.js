const { Router } = require('express');
const { Joi, celebrate } = require('celebrate');
const validator = require('validator');
const mongoose = require('mongoose');
const { getUserGift, createGift, removeGift, buyGift, getAllGifts } = require('../controllers/gifts');
const auth = require('../middlewars/auth');

const router = Router();

const isUrlValidator = (v, h) => {
  if (!validator.isURL(v)) {
    return h.error('any.invalid');
  }
  return v;
};

const objectIdValidator = (v, h) => {
  if (!mongoose.Types.ObjectId.isValid(v)) {
    return h.error('any.invalid');
  }
  return v;
};

router.get('/gifts/user', auth, getUserGift);
router.get('/gifts/all', auth, getAllGifts);
router.post('/gifts/buy/:giftId', celebrate({
  params: Joi.object().keys({
    giftId: Joi.string().alphanum().custom(objectIdValidator, 'idValidator'),
  }),
}), auth, buyGift);
router.post('/gifts', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    photo: Joi.string().required().custom(isUrlValidator, 'isUrl'),
    cost: Joi.number().required(),
    quantity: Joi.number().required(),
  }),
}), auth, createGift);

router.delete('/gifts/:giftId', celebrate({
  params: Joi.object().keys({
    giftId: Joi.string().alphanum().custom(objectIdValidator, 'idValidator'),
  }),
}), auth, removeGift);

module.exports = router;