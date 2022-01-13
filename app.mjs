import express from 'express';
import onlinerSearch from './services/searching.mjs';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/goods', (req, res) => {
  onlinerSearch(req.query.query).then(data => {
    res.send({ ...data.products });
  });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
