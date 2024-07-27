const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productsFilePath = path.join(__dirname, '../data/products.json');

// Función para leer el archivo de productos
const readProductsFile = () => {
  const data = fs.readFileSync(productsFilePath);
  return JSON.parse(data);
};

// Función para escribir en el archivo de productos
const writeProductsFile = (data) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
};

// Ruta GET /api/products
router.get('/', (req, res) => {
  const products = readProductsFile();
  const limit = parseInt(req.query.limit, 10) || products.length;
  res.json(products.slice(0, limit));
});

// Ruta GET /api/products/:pid
router.get('/:pid', (req, res) => {
  const products = readProductsFile();
  const product = products.find(p => p.id === req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
});

// Ruta POST /api/products
router.post('/', (req, res) => {
  const products = readProductsFile();
  const newProduct = {
    id: String(products.length + 1), // Generación simple de ID
    ...req.body,
    status: true,
  };
  products.push(newProduct);
  writeProductsFile(products);
  res.status(201).json(newProduct);
});

// Ruta PUT /api/products/:pid
router.put('/:pid', (req, res) => {
  const products = readProductsFile();
  const index = products.findIndex(p => p.id === req.params.pid);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body, id: products[index].id };
    writeProductsFile(products);
    res.json(products[index]);
  } else {
    res.status(404).send('Product not found');
  }
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
  let products = readProductsFile();
  products = products.filter(p => p.id !== req.params.pid);
  writeProductsFile(products);
  res.status(204).send();
});

module.exports = router;
