const Article = require('../models/article');
const { PermissionError, ArticleNotExist } = require('../errors/errors');
const { dataNotFound, permissionText } = require('../const');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .populate('owner')
    .orFail(new ArticleNotExist(dataNotFound))
    .then((article) => {
      res.send({ data: article });
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.send({ data: article }))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail(new ArticleNotExist(dataNotFound))
    .then((article) => {
      // eslint-disable-next-line eqeqeq
      if (req.user._id == article.owner) {
        return Article.deleteOne(article)
          .then((deletedData) => res.send({ message: 'Статья удалена', data: deletedData }));
      }
      throw new PermissionError(permissionText);
    })
    .catch(next);
};

module.exports = {
  getArticles, createArticle, deleteArticle,
};
