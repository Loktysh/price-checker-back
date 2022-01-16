const { query } = require('express');
const ProductsService = require('../services/products.service');

class ProductsController {
  async getProducts(req, res) {
    let products = {};
    if (req.query.query == false) return res.status(204).send();
    await ProductsService.getProducts(req.query.query).then(data => {
      if (data.total === 0) return res.status(204).send();
      if (data.total !== 0) {
        Object.values(data.products).forEach(e => {
          products[e.id] = {
            id: e.id,
            key: e.key,
            name: e.name,
            extended_name: e.extended_name,
            description: e.description,
            rating: e.reviews.rating,
            image: e.images.header.replace('//', 'https://'),
          };
        });
        return res.status(200).send(products);
      }
    });
  }

  async getPrices(req, res) {
    console.log('prices', req.query.key);
    await ProductsService.getPrices(req.query.key).then(data => {
      console.log('Data: ', data);
      if (data.total === 0) return res.status(204).send();
      return res.status(200).send(data.prices);
    });
  }
}

module.exports = new ProductsController();
