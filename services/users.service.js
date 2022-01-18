const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const TokenService = require('../services/token.service');
class UsersService {
  async registration(login, password) {
    const isUserExist = await UserModel.findOne({ username: login });
    if (isUserExist) {
      throw new Error(`User with login ${login} already exists`);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await new UserModel({ username: login, password: hashPassword });
    console.log(TokenService.generateTokens(user));
    await user.save();
  }
}

module.exports = new UsersService();
