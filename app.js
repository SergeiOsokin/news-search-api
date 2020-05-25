const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routerUsers = require('./routes/user');
const routerArticles = require('./routes/article');
const { auth } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/user')

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.post('/signup', createUser);
app.post('/signin', login);

app.use('/users', auth, routerUsers);
app.use('/articles', auth, routerArticles);

app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));

app.use((err, req, res, next) => {
  if (err.statusCode || err.name === 'ValidationError') {
    return res.status(err.statusCode || 400).send({ message: `Ошибка: ${err.message}` });
  }
  return res.status(500).send({ message: `Ошибка на сервере: ${err.message}` });
});

app.listen(PORT, () => {
  console.log('Begin listening');
});