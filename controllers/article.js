/* eslint-disable no-shadow */
const card = require('../models/card');
const { PermissionError, ArticleNotExist } = require('../errors/errors');

const getArticles = (req, res, next) => {
  card.find({})
    .populate('owner')
    .orFail(new ArticleNotExist('Получить все статьи не удалось'))
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  card.create({ keyword, title, text, date, source, link, image, owner: req.user._id })
    .then((article) => res.send({ data: article }))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  card.findByIdAndDelete(req.params.articleId)
    .orFail(new ArticleNotExist('Статья не нашлась'))
    .then((card) => {
      // eslint-disable-next-line eqeqeq
      if (req.user._id == card.owner) {
        return res.send({ message: 'Статья удалена', data: article });
      }
      throw new PermissionError('Не ваша статья');
    })
    .catch(next);
};


module.exports = {
  getArticles, createArticle, deleteArticle,
};
