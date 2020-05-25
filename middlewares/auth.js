const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');

const auth = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) { // проверяем что заголовок есть
    return res.status(401).send({ message: 'Нет заголовка. Требуется авторизация' });
  }
  const token = cookie.replace('jwt=', ''); // тут извлекаем токен
  let payload;// так сделали из-за области видимости

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Проблема с токеном' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next();
};

module.exports = { auth };
