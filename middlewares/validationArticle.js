const { celebrate, Joi } = require('celebrate');

const urlValidation = Joi.string().required()
  .regex(/(https?:\/\/)(www\.)?((\w+\.\w{2,})|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:\d{2,5})?.*#?/i);

const validationGetArticle = celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});


const validationCreateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(100),
    text: Joi.string().required().min(2),
    date: Joi.string().required().min(2),
    source: Joi.string().required().min(2),
    link: urlValidation,
    image: urlValidation,
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});

const validationDeleteArticle = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().max(30),
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});

module.exports = {
  validationGetArticle,
  validationCreateArticle,
  validationDeleteArticle,
};
