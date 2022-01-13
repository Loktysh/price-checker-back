import fetch from 'node-fetch';

export default async function onlinerSearch(name) {
  console.log('Start fetch', name);
  return await fetch(`https://www.onliner.by/sdapi/catalog.api/search/products?query=${name}`, {
    method: 'GET',
  }).then(res => res.json());
}
