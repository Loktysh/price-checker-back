const UsersService = require('../services/users.service');

class UsersController {
  async register(req, res) {
    try {
      const { login, password } = req.body;
      await UsersService.registration(login, password);
      res.send('User registered');
    } catch (error) {
      res.send('User exists');
    }
  }
}

module.exports = new UsersController();
