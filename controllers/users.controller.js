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

  async authentication(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const renewToken = req.headers.authorization.split(' ')[2];
      // console.log(token, renewToken);
      const userData = await UsersService.authentication(token, renewToken);
      return res.status(200).json(userData);
    } catch (e) {
      res.status(403).send(`Not enough rights. ${e}`);
    }
  }

  async findUser(req, res) {
    try {
      const user = await UsersService.getAllUsers();
      return res.status(200).json(userData);
    } catch (e) {
      console.log('ERR', e);
      res.status(403).send('Not enough rights');
    }
  }
}

module.exports = new UsersController();
