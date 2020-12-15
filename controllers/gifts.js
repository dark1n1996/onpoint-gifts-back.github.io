const Gift = require('../models/gift');
const User = require('../models/user');
const Donation = require('../models/donation');
const UnautorizedError = require('../errors/unautorized-error'); // 401
const ConflictError = require('../errors/conflict-error'); // 409
const BadRequestError = require('../errors/bad-request-error'); // 400
const NotFoundError = require('../errors/not-found-error'); 

const getUserGift = (req, res, next) => {
  const { id } = req.user;
  Gift.find({ owner: id })
    .then((gifts) => {
      res.status(200).send({ gifts });
    })
    .catch(next);
};

const getAllGifts = (req, res, next) => {
  Gift.find({ owner: '5fd4b5d005bb1695b83e1501' })
    .then((gifts) => {
      res.send(gifts)
    })
};

//тут я обновляю админские подарки и создаю подарок для пользователя
const buyGift = (req, res, next) => {
  const { id } = req.user;
  const { giftId } = req.params;
  const { name, description, photo, cost, quantity } = req.body;
  Gift.findById(giftId)
    .then((gift) => {
      if ( gift.quantity < quantity || gift.quantity == 0) {
        return res.send('В таком количестве нет данного подарка :(')
      }
      User.findById(id)
        .then((user) => {
          if (user.starsToSpendQuantity < gift.cost * quantity) {
            return res.send('Не хватает звезд для покупки!')
          }
          Gift.create({
            name, description, photo, cost, quantity, owner: id,
          })
            .catch((err) => {
              if (err.name === 'ValidationError') {
                return next(new BadRequestError('Запрос не прошел валидацию'));
              }
              return next(err);
            });

          const client= user.name;
          Donation.find( {owner: id} )
            .then((spendStars) => {
              Donation.find({ name: client })
                .then((myStars) => {
                  Gift.find({ owner: id })
                    .then((gifts) => {
                      let usedStars = 0; 
                      gifts.map((e) => {
                        usedStars += e.cost * e.quantity;
                      })
                      User.findByIdAndUpdate(id, { 'starsToGiftQuantity': 18 - spendStars.length, 'starsToSpendQuantity': myStars.length - usedStars} , { new: true }) 
                        .catch(next)
                    })
                })
            })

          Gift.findByIdAndUpdate(giftId, {'quantity': gift.quantity - quantity}, {new: true})
            .then((gift) => {
              res.send(gift)
            })
            .catch(next)

            
        })
    })      
};

const createGift = (req, res, next) => {
    const { id } = req.user;
    const { name, description, photo, cost, quantity } = req.body;
    Gift.create({
      name, description, photo, cost, quantity, owner: id,
    })
      .then((gift) => res.status(201).send({ gift }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequestError('Запрос не прошел валидацию'));
        }
        return next(err);
      });
};

const removeGift = (req, res, next) => {
  Gift.findByIdAndRemove(req.params.giftId)
    .then((gift) => {
      res.status(200).send(gift);
    })
    .catch(next);
};

  module.exports = {
    getUserGift,
    getAllGifts,
    createGift,
    removeGift,
    buyGift,
  };
  