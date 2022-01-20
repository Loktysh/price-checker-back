const TokenModel = require('../models/token.model');
const jwt = require('jsonwebtoken');

class TokenService {
  generateTokens(user) {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '12h' });
    const renewToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return { token, renewToken };
  }

  async saveToken(id, renewToken) {
    const tokenData = await TokenModel.findOne({ userId: id });
    console.log(tokenData);
    if (tokenData) {
      tokenData.renewToken = renewToken;
      return tokenData.save();
    }
    const token = await TokenModel.create({ userId: id, renewToken });
    return token;
  }

  async verifyToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }
}

module.exports = new TokenService();
