// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  if (err.statusCode || err.name === 'ValidationError') {
    return res.status(err.statusCode || 400).send({ message: `Ошибка: ${err.message}` });
  }
  return res.status(500).send({ message: `Ошибка на сервере: ${err.message}` });
};

module.exports = { errorMiddleware };
