const bcrypt = require('bcrypt');
const TokenModel = require('../models/token.model');
const UserModel = require('../models/user.model');
const TrackingProductModel = require('../models/tracking-product.model');
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
    return { user: { ...tokenPayload, trackingProducts: user.trackingProducts }, ...tokens };
  }

  async login(login, password) {
    const user = await UserModel.findOne({ login });
    if (!user) throw new Error('Пользователь с таким email не найден');
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) throw new Error('Неверный пароль');
    const tokenPayload = { login: user.login, user: user._id };
    const tokens = TokenService.generateTokens(user);
    await TokenService.saveToken(user._id, tokens.renewToken);
    return { user: { ...tokenPayload, trackingProducts: user.trackingProducts }, ...tokens };
  }

  async authentication(currentToken, currentRenewToken) {
    let token = await TokenService.verifyAccessToken(currentToken);
    let renewToken = await TokenService.verifyRenewToken(currentRenewToken);
    let tokens = { currentToken, currentRenewToken };
    const user = await UserModel.findOne({ _id: renewToken.user });
    if (!user) throw new Error(`Can't find user with id ${renewToken.user}`);
    const tokenPayload = { login: user.login, user: user._id };
    if (!token) {
      if (!renewToken) throw new Error('Wrong renewToken');
      let dbToken = await TokenModel.findOne({ userId: user._id });
      if (dbToken.renewToken === currentRenewToken) {
        tokens = await TokenService.generateTokens({ login: user.login, password: user.password });
        await TokenService.saveToken(user._id, tokens.renewToken);
      } else throw new Error('Wrong renewToken');
    }
    const authData = {
      user: { ...tokenPayload, trackingProducts: user.trackingProducts },
      ...tokens,
    };
    return authData;
  }

  async trackProduct(login, product) {
    try {
      console.log('Tracking...');
      const telegramID = (await UserModel.findOne({ login })).telegramID;
      const isProductInDB = TrackingProductModel.findOne({ key: product });
      const isProductTracking = TrackingProductModel.findOne({ key: product, subscribers: login });
      const isTrackingByUser = UserModel.findOne({ login: login, trackingProducts: product });
      const isNotificationOn = async () =>
        !!(await UserModel.findOne({ login: login, isNotificationOn: true }));
      console.log('Telegram subscriber:', await isNotificationOn());
      console.log('Уже есть в trackingProducts: ', !!(await isTrackingByUser.clone()));
      const isAdded = async () =>
        !!(await isProductTracking.clone()) && !!(await isTrackingByUser.clone());
      if (!(await isProductInDB)) {
        console.log('Добавляем новый продукт в бд');
        const newProduct = await new TrackingProductModel({ key: product, subscribers: [] });
        await newProduct.save();
      }
      if (!(await isProductTracking)) {
        console.log('Добавляем отслеживание продукта для пользователя');
        await TrackingProductModel.findOneAndUpdate(
          { key: product },
          { $addToSet: { subscribers: login } },
          { new: true }
        );
        if (await isNotificationOn()) {
          console.log('Добавляем продукт для уведомлений пользователю');
          await TrackingProductModel.findOneAndUpdate(
            { key: product },
            { $addToSet: { botSubscribers: telegramID } },
            { new: true }
          );
        }
        await UserModel.findOneAndUpdate(
          { login: login },
          { $addToSet: { trackingProducts: product } },
          { new: true }
        );
      }
      console.log('Успешно добавлено: ', await isAdded());
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async untrackProduct(login, product) {
    try {
      console.log('Untracking...');
      const telegramID = (await UserModel.findOne({ login })).telegramID;
      const isProductInDB = TrackingProductModel.findOne({ key: product });
      const isProductTracking = TrackingProductModel.findOne({ key: product, subscribers: login });
      const isTrackingByUser = UserModel.findOne({ login: login, trackingProducts: product });
      const isFulfilled = async () =>
        !!(await isProductTracking.clone()) && !!(await isTrackingByUser.clone());
      console.log('Уже отслеживается пользователем: ', await isFulfilled());
      if ((await isProductTracking) && (await isTrackingByUser)) {
        console.log('Убираем отслеживание продукта для пользователя');
        await TrackingProductModel.findOneAndUpdate(
          { key: product },
          { $pull: { subscribers: login } },
          { new: true }
        );
        await TrackingProductModel.findOneAndUpdate(
          { key: product },
          { $pull: { botSubscribers: telegramID } },
          { new: true }
        );
        await UserModel.findOneAndUpdate(
          { login: login },
          { $pull: { trackingProducts: product } },
          { new: true }
        );
        const isNoSubscriptions =
          !(await isProductInDB.clone()).subscribers.length &&
          !(await isProductInDB.clone()).botSubscribers.length;
        if (isNoSubscriptions) await isProductInDB.clone().deleteOne();
      }
      console.log('Успешно удалено: ', await isFulfilled());
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async findUser(userId) {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) throw new Error(`Can't find user with id ${userId}`);
    return user;
  }
}

module.exports = new UsersService();
