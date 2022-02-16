const express = require('express');
const mongoose = require('mongoose');
const ProductsController = require('./controllers/products.controller');
const UsersController = require('./controllers/users.controller');
const dotenv = require('dotenv');
const cors = require('cors');
const parser = require('body-parser');
const test = require('./services/users.service');
const app = express();
const port = process.env.PORT || 3001;
dotenv.config();

app.use(cors());
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/products', ProductsController.getProducts);
app.get('/product', ProductsController.getProduct);
app.get('/prices', ProductsController.getPrices);
app.post('/registration', UsersController.registration);
app.post('/login', UsersController.login);
app.post('/auth', UsersController.authentication);
app.post('/products/track', (req, res) => UsersController.trackingProduct(req, res));
app.get('/', (req, res) => {
  res.send('Not found').status(404);
});

const init = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(port, () => {
      console.log(`Server is runnging at http://localhost:${port}
      Connected to MongoDB`);
    });
    test.untrackProduct('123123', 'I1ntel Core');
  } catch (error) {
    console.log(error);
  }
};
init();
