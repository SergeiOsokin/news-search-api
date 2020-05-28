# news-search-api
Backend for diploma project

Version 1.0.9

К серверу можно обратиться по следующим адресам:
Публичный IP 84.201.147.125
Домен 
api.news-search.tk
www.api.news-search.tk

Команды:
GET /users/me # возвращает информацию о пользователе (email и имя)
GET /articles # возвращает все сохранённые пользователем статьи

POST /articles # создаёт статью с переданными в теле: keyword, title, text, date, source, link и image

DELETE /articles/articleId # удаляет сохранённую статью  по _id
