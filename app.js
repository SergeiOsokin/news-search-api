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
const { requestLogger, errorLogger } = require('./middlewares/loggers');
const { validationCreateUser, validationLogin } = require('./middlewares/validationUser');
const { errorMiddleware } = require('./middlewares/errorMiddlewares');
const { NotFound } = require('./errors/errors');
const { resourceNotFound } = require('./const');
const { PORT, DATABASE_URL } = require('./config');

const app = express();
app.use(cookieParser());
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true,
};
app.use(cookieParser());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(requestLogger);
app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

app.use(cookieParser());

app.use('/users', auth, routerUsers);
app.use('/articles', auth, routerArticles);

app.use(errorLogger);
app.use('*', (req, res, next) => next(new NotFound(resourceNotFound)));
app.use(errors());
app.use(errorMiddleware);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Begin listening^');
});
