const fetch = require('node-fetch');
const TrackingProductModel = require('../models/tracking-product.model');

class ProductsService {
  getProducts(name) {
    console.log('start fetch')
    return fetch(`https://www.onliner.by/sdapi/catalog.api/search/products?query=${name}`).then(
      res => res.json()
    );
  }

  getPrices(key, months) {
    return fetch(
      `https://catalog.api.onliner.by/products/${key}/prices-history?period=${months}m`
    ).then(res => res.json());
  }

  async getDBPrices(key) {
    // let res = (await TrackingProductModel.findOne({ key: key })).key;
    let res = {
      "chartsDB": [
        {
          "date": "2021-09-20-09",
          "price": "488.17"
        },
        {
          "date": "2021-09-20-12",
          "price": "550.00"
        },
        {
          "date": "2021-09-20-18",
          "price": "678.89"
        },
        {
          "date": "2021-09-20-21",
          "price": "656.50"
        }
      ],
    }
    return res;
  }
}

module.exports = new ProductsService();
