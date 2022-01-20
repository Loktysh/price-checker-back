const express = require('express');
const cors = require('cors');
const ProductsController = require('./controllers/products.controller');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.get('/products', ProductsController.getProducts);
app.get('/prices', ProductsController.getPrices);
app.listen(port, () => {
  console.log(`Server launched.`);
});

app.get('/', (req, res) => {
  res.send('Not found').status(404);
});
