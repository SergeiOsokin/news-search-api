const { NotUniqueUser } = require('../errors/errors');

const errorMiddleware = (err, req, res, next) => {
  const notUnique = new NotUniqueUser('Пользователь с таким email существует');
  const errObjectId = err.message
    .startsWith('Cast to ObjectId failed') ? 'Ошибка в присланном идентификаторе статьи' : null;
  if (err.statusCode || err.name === 'ValidationError') {
    return res.status(err.statusCode || 400).send({ message: `Ошибка: ${err.message}` });
  }
  if (err.message.startsWith('E11000 duplicate key error')) {
    return res.status(notUnique.statusCode).send({ message: `${notUnique.message}` });
  }
  return res.status(500).send({ message: `Ошибка: ${errObjectId || err.message}` });
};
module.exports = { errorMiddleware };
