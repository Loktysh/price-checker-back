const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const TokenService = require('../services/token.service');
class UsersService {
  async registration(login, password) {
    const isUserExist = await UserModel.findOne({ login });
    if (isUserExist) {
      throw new Error(`User with login ${login} already exists`);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await new UserModel({ login: login, password: hashPassword });
    const tokenPayload = { login: user.login, user: user._id };
    const tokens = await TokenService.generateTokens(user);
    await TokenService.saveToken(user._id, tokens.renewToken);
    await user.save();
    return { user: tokenPayload, ...tokens };
  }

  async login(login, password) {
    const user = await UserModel.findOne({ login });
    if (!user) throw new Error('Пользователь с таким email не найден');
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) throw new Error('Неверный пароль');
    const tokenPayload = { login: user.login, user: user._id };
    const tokens = TokenService.generateTokens(user);
    await TokenService.saveToken(user._id, tokens.renewToken);
    return { user: tokenPayload, ...tokens };
  }
}

module.exports = new UsersService();
