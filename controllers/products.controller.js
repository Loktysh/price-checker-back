const ProductsService = require('../services/products.service');

class ProductsController {
  async getProducts(req, res) {
    let allProducts = { products: [] };
    if (req.query.query == false) return res.status(204).send();
    await ProductsService.getProducts(req.query.query).then(data => {
      if (data.total === 0) return res.status(204).send();
      if (data.total !== 0) {
        Object.values(data.products).forEach(e => {
          allProducts.products.push({
            id: e.id,
            key: e.key,
            name: e.name,
            extended_name: e.extended_name,
            description: e.description,
            rating: e.reviews.rating,
            price_min: e.prices.price_min.amount,
            image: e.images.header.replace('//', 'https://'),
          });
        });
        return res.status(200).send(allProducts);
      }
    });
  }

  async getPrices(req, res) {
    await ProductsService.getPrices(req.query.key, req.query.months).then(data => {
      if (data.message) return res.status(204).send();
      let prices = {
        current: data.prices.current.amount,
        min: data.prices.min.amount,
        max: data.prices.max,
        min_median: data.sale.min_prices_median.amount,
        charts: data.chart_data.items,
      };
      return res.status(200).send(prices);
    });
  }
}

module.exports = new ProductsController();
