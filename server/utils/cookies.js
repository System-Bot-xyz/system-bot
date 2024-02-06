const cookieParser = require('cookie-parser');

module.exports = function(app) {
  app.use(cookieParser());

  app.get('/set-cookie', function(req, res) {
    res.cookie('user', 'John Doe', { maxAge: 900000, httpOnly: true });
    res.send('Cookie set');
  });

  app.get('/get-cookie', function(req, res) {
    var user = req.cookies.user;
    if (user === undefined) {
      res.send('No cookie found');
    } else {
      res.send('User: ' + user);
    }
  });
};