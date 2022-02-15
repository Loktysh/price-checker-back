const ProductsService = require('../services/products.service');

class ProductsController {
  async getProducts(req, res) {
    const result = {
      products: [],
    };
    if (!req.query.query) {
      return res.status(204).send(result);
    }
    const data = await ProductsService.getProducts(req.query.query);
    if (data.total > 0) {
      Object.values(data.products).forEach((element) => {
        result.products.push({
          id: element.id,
          key: element.key,
          extended_name: element.extended_name,
          description: element.description,
          rating: element.reviews.rating,
          price_min: element?.prices?.price_min.amount,
          image: element.images.header.replace('//', 'https://'),
        });
      });
    }
    return res.status(200).send(result);
  }

  async getProduct(req, res) {
    let result = {};
    if (!req.query.key) {
      return res.status(204).send({});
    }
    const data = await ProductsService.getProducts(req.query.key);
    const dbPrices = await ProductsService.getDBPrices(req.query.key);
    console.log('DB prices: ', dbPrices);
    let charts = await ProductsService.getPrices(req.query.key, 6).then((data) => {
      if (data.message) return res.status(204).send();
      const prices = {
        current: data.prices.current.amount,
        min: data.prices.min.amount,
        max: data.prices.max,
        min_median: data.sale.min_prices_median.amount,
        charts: data.chart_data.items,
      };
      return prices.charts;
    });
    if (data.total === 1) {
      Object.values(data.products).forEach((element) => {
        console.log(data.products);
        result = {
          id: element.id,
          key: element.key,
          extended_name: element.extended_name,
          description: element.description,
          rating: element.reviews.rating,
          price_min: element?.prices?.price_min.amount,
          image: element.images.header.replace('//', 'https://'),
          charts: charts,
          chartsDB: dbPrices.chartsDB,
        };
      });
    }
    return res.status(200).send(result);
  }

  async getPrices(req, res) {
    await ProductsService.getPrices(req.query.key, req.query.months).then((data) => {
      if (data.message) return res.status(204).send();
      const prices = {
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
