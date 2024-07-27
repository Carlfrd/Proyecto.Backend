const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const cartsFilePath = path.join(__dirname, '../data/carts.json');

// Función para leer el archivo de carritos
const readCartsFile = () => {
  const data = fs.readFileSync(cartsFilePath);
  return JSON.parse(data);
};

// Función para escribir en el archivo de carritos
const writeCartsFile = (data) => {
  fs.writeFileSync(cartsFilePath, JSON.stringify(data, null, 2));
};

// Ruta POST /api/carts
router.post('/', (req, res) => {
  const carts = readCartsFile();
  const newCart = {
    id: String(carts.length + 1),
    products: [],
  };
  carts.push(newCart);
  writeCartsFile(carts);
  res.status(201).json(newCart);
});

// Ruta GET /api/carts/:cid
router.get('/:cid', (req, res) => {
  const carts = readCartsFile();
  const cart = carts.find(c => c.id === req.params.cid);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).send('Cart not found');
  }
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  const carts = readCartsFile();
  const cart = carts.find(c => c.id === req.params.cid);
  if (cart) {
    const productIndex = cart.products.findIndex(p => p.product === req.params.pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }
    writeCartsFile(carts);
    res.status(201).json(cart);
  } else {
    res.status(404).send('Cart not found');
  }
});

module.exports = router;
