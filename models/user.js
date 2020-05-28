const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { BadAuthData } = require('../errors/errors');
const { notFoundUserEmail, wrongPasswordOrLogin } = require('../const');

const user = new mongoose.Schema({
  email: {
    type: String,
    index: {
      unique: true,
    },
    required: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    select: false, // при создании пользователя не сработает. Сработает при поиске/фильтрации
    type: String,
    minlength: 6,
    required: true,
  },
},
{ versionKey: false });

user.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password') // добавляем, чтобы был хэш, если аторизация норм.
    .then((usercard) => {
      if (!usercard) {
        throw new BadAuthData(notFoundUserEmail);
      }
      return bcrypt.compare(password, usercard.password)
        .then((matched) => {
          if (!matched) {
            throw new BadAuthData(wrongPasswordOrLogin);
          }
          return usercard;
        });
    });
};
// скроем пароль при возвращении созданного пользователя
user.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', user);
