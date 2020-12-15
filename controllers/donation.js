const mongoose = require('mongoose');
const Donation = require('../models/donation');
const User = require('../models/user');
const Gift = require('../models/gift');
const NotFoundError = require('../errors/not-found-error'); // 404
const BadRequestError = require('../errors/bad-request-error'); // 400
const ForbiddenError = require('../errors/forbidden-error'); // 403
const donation = require('../models/donation');

const getDonat = (req, res, next) => {
  Donation.find({ })
    .then((donats) => res.status(200).send({ donats }))
    .catch(next); 
};

const makeDonat = (req, res, next) => {
  const { name, competence, comment } = req.body;
  const { id } = req.user;
  Donation.find({ owner: id})
    .then((donat) => {
      if (donat.length > 18) {
        return res.status(403).send({error: 'К сожалению, у Вас закончились звезды :('})
      }
      Donation.find({ name: name, owner: id})
      .then((donat) => {
        if (donat[0]) {
          return res.status(403).send({error: 'Вы уже дарили этому сотруднику звезду'});
        }
        Donation.find({ competence: competence, owner: id})
          .then((donat) => {
            if (donat.length > 3) {
              return res.status(403).send({error: 'Нельзя подарить более 4-х звезд за одну компетенцию'});
            }
            User.findById(id)
              .then((user) => {
                const name = user.name;
                Donation.find( {owner: id} )
                .then((spendStars) => {
                  Donation.find({ name: name })
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
                .catch(next)
              }) 
            Donation.create({
              name, competence, comment, owner: req.user.id,
            })
              .then(() => res.status(201).send({success: 'Ура, твоя звездочка отправлена!'}))
              .catch((err) => {
                if (err.name === 'ValidationError') {
                  return next(new BadRequestError('Запрос не прошел валидацию'));
                }
                return next(err);
          })   
        }); 
      })
    })
    .catch(next);
};

module.exports = {
  makeDonat,
  getDonat,
};
