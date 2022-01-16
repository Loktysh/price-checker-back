const fetch = require('node-fetch');

class ProductsService {
  getProducts(name) {
    return fetch(`https://www.onliner.by/sdapi/catalog.api/search/products?query=${name}`).then(
      res => res.json()
    );
  }

  getPrices(key, months) {
    return fetch(
      `https://catalog.api.onliner.by/products/${key}/prices-history?period=${months}m`
    ).then(res => res.json());
  }
}

module.exports = new ProductsService();
