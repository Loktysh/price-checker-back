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
      const isAuth = await UsersService.authentication(token, renewToken);
      if (isAuth) {
        console.log('User ok', isAuth.user.user);
        // const message = await UsersService.trackingProduct(isAuth.user.user, product, action);
        // console.log('msg', message);

        if (action === 'track') {
          let a = await UsersService.trackProduct(isAuth.user.user, product);
          console.log(a);
          return res.status(200).json({message: a})
        }
        if (action === 'untrack') {
          
        }
      };
      res.status(403).send('Not enough rights');
    } catch (e) {
      // res.status(403).send('Not enough rights');
      res.status(403).send(e);
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
