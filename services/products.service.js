const fetch = require('node-fetch');

const fetchProductInfo = async name =>
  fetch(`https://www.onliner.by/sdapi/catalog.api/search/products?query=${name}`).then(res =>
    res.json()
  );

class ProductsService {
  getProducts(name) {
    return fetchProductInfo(name);
  }

  getPrices(key) {
    return fetch(`https://catalog.api.onliner.by/products/${key}/prices-history`).then(res =>
      res.json()
    );
  }
}

module.exports = new ProductsService();
