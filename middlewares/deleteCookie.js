const deleteCookie = (req, res) => {
  res
    .cookie('jwt', '', { domain: '', maxAge: 1 })
    .end();
};

module.exports = {
  deleteCookie,
};
