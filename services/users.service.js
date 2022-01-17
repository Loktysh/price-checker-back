const UserModel = require('../models/user.model');
class UsersService {
  async registration(login, password) {
    const isUserExist = await UserModel.findOne({ username: login });
    if (isUserExist) {
      throw new Error(`User with login ${login} already exists`);
    }
    const user = new UserModel({ username: login, password: password });
    await user.save();
  }
}

module.exports = new UsersService();
