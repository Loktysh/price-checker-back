const express = require('express');
const onlinerSearch = require('./services/searching.js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/login', (req, res) => {});
app.get('/goods', (req, res) => {
  onlinerSearch(req.query.query).then(data => {
    res.send({ ...data.products });
  });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
