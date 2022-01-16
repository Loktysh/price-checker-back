const ProductsService = require('../services/products.service');

class ProductsController {
  async getProducts(req, res) {
    let products = {};
    await ProductsService.getProducts(req.query.query).then(data => {
      if (data.total === 0) return res.status(204).send();
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
    });
  }
}

module.exports = new ProductsController();
