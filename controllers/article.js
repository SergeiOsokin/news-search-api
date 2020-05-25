/* eslint-disable no-shadow */
const Article = require('../models/article');
const { PermissionError, ArticleNotExist } = require('../errors/errors');

const getArticles = (req, res, next) => {
  Article.find({})
    .populate('owner')
    .orFail(new ArticleNotExist('Получить все статьи не удалось'))
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({ keyword, title, text, date, source, link, image, owner: req.user._id })
    .then((article) => res.send({ data: article }))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findByIdAndDelete(req.params.articleId)
    .orFail(new ArticleNotExist('Статья не нашлась'))
    .then((article) => {
      // eslint-disable-next-line eqeqeq
      if (req.user._id == article.owner) {
        return res.send({ message: 'Статья удалена', data: article });
      }
      throw new PermissionError('Не ваша статья');
    })
    .catch(next);
};


module.exports = {
  getArticles, createArticle, deleteArticle,
};
