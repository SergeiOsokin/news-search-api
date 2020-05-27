class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
class BadAuthData extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class NotYourProfile extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class PermissionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class BadToken extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class ArticleNotExist extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class NotHeaders extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class NotUniqueUser extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = {
  NotFound,
  BadAuthData,
  NotYourProfile,
  BadToken,
  PermissionError,
  ArticleNotExist,
  NotHeaders,
  NotUniqueUser,
};
