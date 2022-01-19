const express = require('express');
const mongoose = require('mongoose');
const ProductsController = require('./controllers/products.controller');
const UsersController = require('./controllers/users.controller');
const dotenv = require('dotenv');
const cors = require('cors');
const parser = require('body-parser');

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
app.get('/prices', ProductsController.getPrices);
app.post('/registration', UsersController.register);
app.post('/login', UsersController.login);

const init = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
init();
