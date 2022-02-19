const fetch = require('node-fetch');
const TrackingProductModel = require('../models/tracking-product.model');

class ProductsService {
  async getProducts(name, page = 1) {
    return fetch(`https://www.onliner.by/sdapi/catalog.api/search/products?query=${name}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        let allProducts = [];
        Object.values(data.products).forEach(product => {
          let productData = {
            id: product.id,
            key: product.key,
            extended_name: product.extended_name,
            description: product.description,
            rating: product.reviews.rating,
            price_min: product?.prices?.price_min.amount,
            image: product.images.header.replace('//', 'https://'),
          };
          allProducts.push(productData);
        });
        return {products: allProducts};
      });
  }

  async getProduct(key) {
    return (await this.getProducts(key)).products[0];
  }

  async getLastProducts(count) {
    return (await TrackingProductModel.find().sort('-created_at')).reverse().splice(0, count);
  }

  async getPrices(key, months = 6) {
    return fetch(`https://catalog.api.onliner.by/products/${key}/prices-history?period=${months}m`)
      .then(res => res.json())
      .then(data => {
        if (data.message) return null;
        const prices = {
          charts: data.chart_data.items,
          current: data.prices.current.amount,
          min: data.prices.min.amount,
          max: data.prices.max,
          min_median: data.sale.min_prices_median.amount,
        }
        return prices;
      });
  }

  async getDBPrices(key) {
    const prices = await TrackingProductModel.findOne({ key: key });
    return { dbCharts: !prices ? [] : prices.charts };
  }
}

module.exports = new ProductsService();
