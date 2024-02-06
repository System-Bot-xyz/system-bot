const csrf = require('csurf');

module.exports = function(app) {
  app.use(csrf());

  app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
  });
};