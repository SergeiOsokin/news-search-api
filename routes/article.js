const routerArticles = require('express').Router();
const { getArticles, createArticle, deleteArticle } = require('../controllers/article');
const { validationGetArticle,
  validationCreateArticle,
  validationDeleteArticle, } = require('../middlewares/validationArticle');

routerArticles.get('/', validationGetArticle, getArticles);

routerArticles.post('/', validationCreateArticle, createArticle);

routerArticles.delete('/:articleId', validationDeleteArticle, deleteArticle);

module.exports = routerArticles;
