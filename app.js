const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use((err, req, res, next) => {
  if (err.statusCode || err.name === 'ValidationError') {
    return res.status(err.statusCode || 400).send({ message: `Ошибка: ${err.message}` });
  }
  return res.status(500).send({ message: `Ошибка на сервере: ${err.message}` });
});

app.listen(PORT, () => {
  console.log('Begin listening');
});