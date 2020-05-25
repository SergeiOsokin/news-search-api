const routerArticles = require('express').Router();

routerArticles.get('/');

routerArticles.post('/');

routerArticles.delete('/:articleId');

module.exports = routerArticles;
