const UsersService = require('../services/users.service');

class UsersController {
  constructor(params) {}

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
      console.log(e);
      res.status(400).send('Login error');
    }
  }

  async authentication(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const renewToken = req.headers.authorization.split(' ')[2];
      const userData = await UsersService.authentication(token, renewToken);
      return res.status(200).json(userData);
    } catch (e) {
      res.status(403).send(`Not enough rights. ${e}`);
    }
  }

  async trackingProduct(req, res) {
    try {
      const { product, action } = req.body;
      const token = req.headers.authorization.split(' ')[1];
      const renewToken = req.headers.authorization.split(' ')[2];
      const userData = await UsersService.authentication(token, renewToken);
      if (action === 'track') {
        const isFulfilled = await UsersService.trackProduct(userData.user.user, product);
        return isFulfilled
          ? res.status(200).json({ message: 'Product tracked', ...userData })
          : res.status(200).json({ message: 'Can not track product', ...userData });
      }
      if (action === 'untrack') {
        const isFulfilled = await UsersService.untrackProduct(userData.user.user, product);
        return isFulfilled
          ? res.status(200).json({ message: 'Product untracked', ...userData })
          : res.status(400).json({ message: 'Product not untracked', ...userData });
      }
    } catch (e) {
      res.status(401).send('Unathorized: ' + e);
    }
  }

  async findUser(req, res) {
    try {
      const user = await UsersService.getAllUsers();
      return res.status(200).json(userData);
    } catch (e) {
      res.status(403).send('Not enough rights');
    }
  }
}

module.exports = new UsersController();
