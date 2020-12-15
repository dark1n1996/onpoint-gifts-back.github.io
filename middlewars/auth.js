const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unautorized-error');

const auth = (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    throw new UnauthorizedError('Требуется авторизация');
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedError('Требуется авторизация'));
  }
  req.user = payload;

  return next();
};

module.exports = auth;
