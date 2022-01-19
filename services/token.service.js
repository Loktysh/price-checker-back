const TokenModel = require('../models/token.model');
const jwt = require('jsonwebtoken');

class TokenService {
  generateTokens(user) {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const renewToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return { token, renewToken };
  }

  async saveToken(id, renewToken) {
    // console.log('ID:', id);
    console.log('tkn', renewToken);
    const tokenData = await TokenModel.findOne({ login: id });
    if (tokenData) {
      // console.log('Есть юзер с токеном', renewToken);
      tokenData.renewToken = renewToken;
      return tokenData.save();
    }
    const token = await TokenModel.create({ userId: id, renewToken });
    return token;
  }
}

module.exports = new TokenService();
