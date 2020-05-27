/* eslint-disable radix */

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'develop',
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/test',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
};
