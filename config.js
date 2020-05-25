/* eslint-disable radix */

module.exports = {
  NODE_ENV: parseInt(process.env.NODE_ENV) || 'develop',
  PORT: parseInt(process.env.PORT) || 3000,
  DATABASE_URL: 'mongodb://localhost:27017/newsdb',
  JWT_SECRET: parseInt(process.env.JWT_SECRET) || 'secret',
};
