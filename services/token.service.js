const TokenModel = require('../models/token.model');
const jwt = require('jsonwebtoken');

class TokenService {
  generateTokens(user) {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '10d' });
    const renewToken = jwt.sign({ user }, process.env.JWT_REFRESH, { expiresIn: '10d' });
    return { token, renewToken };
  }

  async saveToken(id, renewToken) {
    const tokenData = await TokenModel.findOne({ userId: id });
    if (tokenData) {
      tokenData.renewToken = renewToken;
      return tokenData.save();
    }
    const token = await TokenModel.create({ userId: id, renewToken });
    return token;
  }

  async verifyAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async verifyRenewToken(token) {
    try {
      const userData = jwt.verify(token.trim(), process.env.JWT_REFRESH);
      return userData;
    } catch (e) {
      return null;
    }
  }
}

module.exports = new TokenService();
