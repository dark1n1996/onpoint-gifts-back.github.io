const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Donation = require('../models/donation');
const Gift = require('../models/gift');
const UnautorizedError = require('../errors/unautorized-error'); // 401
const ConflictError = require('../errors/conflict-error'); // 409
const BadRequestError = require('../errors/bad-request-error'); // 400

const readUser = (req, res, next) => {
  const {id} = req.user;
  User.findById(id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

const readAllUsers = (req, res, next) => {
  User.find({ })
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      Donation.find({ name: name })
        .then((donat) => {
          User.create({ email, password, name, starsToGiftQuantity: 18, 
            starsToSpendQuantity: donat.length
          })
        .then((user) => {
          User.findByIdAndUpdate(user._id, { password: `${hash}` }, { new: true })
            .then((client) => res.status(201).send({ client }))
            .catch(next);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Запрос не прошел валидацию'));
          }
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с такой электронной почтой уже существует'));
          }
          return next(err);
        });
        })
        .catch(next)
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { password, email } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnautorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnautorizedError('Неправильные почта или пароль');
          }
          const token = jwt.sign({ id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          res.cookie('jwt', token, { httpOnly: false, maxAge: 3600000 * 7 * 24, domain: 'localhost' }).send({
            email: user.email,
            name: user.name,
            starsToGiftQuantity: user.starsToGiftQuantity
          }).end();
        })
        .catch(next);
    })
    .catch(next);
};

//тут нужно искать пользователя не используя его имя, а используя только id
const updateUser = (req, res, next) => {
  const { id } = req.user;
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
                  .then((user) => {
                    res.send(user)
                  })
                  .catch(next)
              })
          })
      })
      .catch(next)
    }) 
}


module.exports = {
  readUser,
  readAllUsers,
  createUser,
  login,
  updateUser
};
