const express = require('express');
const ProductsController = require('./controllers/products.controller');
const UsersController = require('./controllers/users.controller');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/products', ProductsController.getProducts);
app.get('/prices', ProductsController.getPrices);
app.post('/register', UsersController.register);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
