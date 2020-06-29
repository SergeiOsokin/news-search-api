const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { limiter } = require('./rateLimit-config');

const { routerUsers, routerArticles } = require('./routes/index');
const { createUser, login } = require('./controllers/user');
const { auth } = require('./middlewares/auth');
const { deleteCookie } = require('./middlewares/deleteCookie');
const { requestLogger, errorLogger } = require('./middlewares/loggers');
const { validationCreateUser, validationLogin } = require('./middlewares/validationUser');
const { errorMiddleware } = require('./middlewares/errorMiddlewares');
const { NotFound } = require('./errors/errors');
const { resourceNotFound } = require('./const');
const { PORT, DATABASE_URL } = require('./config');

const whitelist = [
  'http://localhost:8080',
  'http://127.0.0.1:5500',
  'https://sergeiosokin.github.io',
  'https://www.news-search.tk',
  'http://www.news-search.tk'];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const app = express();
app.use(cookieParser());
app.use(cors(corsOptions));
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});


app.use(cookieParser());
app.use(limiter);
app.use(bodyParser.json());
app.use(helmet());

app.use(cookieParser());
app.use(requestLogger);
app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

app.use(cookieParser());

app.use('/users', auth, routerUsers);
app.use('/articles', auth, routerArticles);
app.delete('/deletecookie', auth, deleteCookie);

app.use(errorLogger);
app.use('*', (req, res, next) => next(new NotFound(resourceNotFound)));
app.use(errors());
app.use(errorMiddleware);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Begin listening^');
});
