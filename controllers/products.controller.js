const ProductsService = require('../services/products.service');

class ProductsController {
  async getProducts(req, res) {
    if (!req.query.query || !req.query.page) {
      return res.status(400).send('Wrong query');
    }
    const data = await ProductsService.getProducts(req.query.query, req.query.page);
    return res.status(200).send(data);
  }

  async getProduct(req, res) {
    if (!req.query.key) {
      return res.status(204).send({});
    }
    const productData = await ProductsService.getProduct(req.query.key);
    const prices = await ProductsService.getPrices(req.query.key);
    const dbPrices = await ProductsService.getDBPrices(req.query.key);
    return res.status(200).send({ ...productData, prices: { ...prices, ...dbPrices } });
  }

  async getLastProducts(req, res) {
    if (!req.query.count) {
      return res.status(400).send('Wrong count');
    }
    const data = await ProductsService.getLastProducts(req.query.count);
    return res.status(200).send(data);
  }

  async getPrices(req, res) {
    const prices = await ProductsService.getPrices(req.query.key, req.query.months)
    return res.status(200).send({ prices: prices });
  }
}

module.exports = new ProductsController();
