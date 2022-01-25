const bcrypt = require('bcrypt');
const TokenModel = require('../models/token.model');
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

  async authentication(currentToken, currentRenewToken) {
    let token = await TokenService.verifyAccessToken(currentToken);
    let renewToken = await TokenService.verifyRenewToken(currentRenewToken);
    let tokens = { currentToken, currentRenewToken };
    const user = await UserModel.findOne({ _id: renewToken.user });
    if (!user) throw new Error(`Can't find user with id ${renewToken.user}`);
    const tokenPayload = { login: user.login, user: user._id };
    if (!token) {
      if (!renewToken) throw new Error('Wrond renewToken');
      let dbToken = await TokenModel.findOne({ userId: user._id });
      if (dbToken.renewToken === currentRenewToken) {
        tokens = await TokenService.generateTokens({ login: user.login, password: user.password });
        await TokenService.saveToken(user._id, tokens.renewToken);
      } else throw new Error('Wrong renewToken');
    }
    const authData = { user: tokenPayload, ...tokens };
    return authData;
  }
}

module.exports = new UsersService();
