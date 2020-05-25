const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const routerUsers = require('./routes/user');
const routerArticles = require('./routes/article');
const { auth } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/user');
const { requestLogger, errorLogger } = require('./middlewares/loggers');
const {  validationCreateUser,  validationLogin } = require('./middlewares/validationUser');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(limiter);
app.use(bodyParser.json());
app.use(helmet());

app.use(requestLogger);
app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

app.use('/users', auth, routerUsers);
app.use('/articles', auth, routerArticles);

app.use(errorLogger);
app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));
app.use(errors());
app.use((err, req, res, next) => {
  if (err.statusCode || err.name === 'ValidationError') {
    return res.status(err.statusCode || 400).send({ message: `Ошибка: ${err.message}` });
  }
  return res.status(500).send({ message: `Ошибка на сервере: ${err.message}` });
});

app.listen(PORT, () => {
  console.log('Begin listening', NODE_ENV);
});