const jwt = require('jsonwebtoken');

class TokenService {
  async generateTokens(user) {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  }
}

module.exports = new TokenService();
