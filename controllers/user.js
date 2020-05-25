/* eslint-disable no-shadow */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { NotYourProfile, NotFoundUser } = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secretik',
        { expiresIn: '7d' });
      res
        .cookie('jwt', token, { httpOnly: true, sameSite: true })
        .end();
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundUser('Нет такого юзера'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name
      })
        .then((user) => res.send({ data: user }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getUser, createUser, login,
};
