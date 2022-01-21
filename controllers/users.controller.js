const UsersService = require('../services/users.service');

class UsersController {
  async registration(req, res) {
    try {
      const { login, password } = req.body;
      const userData = await UsersService.registration(login, password);
      return res.status(200).json(userData);
    } catch (error) {
      res.status(400).send('User exists');
    }
  }

  async login(req, res) {
    try {
      const { login, password } = req.body;
      const userData = await UsersService.login(login, password);
      return res.status(200).json(userData);
    } catch (e) {
      res.status(400).send('Login error');
    }
  }
}

module.exports = new UsersController();
