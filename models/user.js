const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { NotFoundUser, BrokenPassword } = require('../errors/errors');

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
    .then((user) => {
      if (!user) {
        throw new NotFoundUser('Не удалось найти пользователя с таким email');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new BrokenPassword('Не правильный логин или пароль');
          }
          return user;
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
