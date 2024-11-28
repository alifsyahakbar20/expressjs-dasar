const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_FILE = './data.json';

function readData() {
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ini route
app.get('/items', (req, res) => {
  const items = readData();
  res.json(items);
});

app.post('/items', (req, res) => {
  const items = readData();
  const newItem = {
    id: items.length ? items[items.length - 1].id + 1 : 1,
    name: req.body.name,
    price: req.body.price,
  };
  items.push(newItem);
  writeData(items);
  res.status(201).json(newItem);
});

app.put('/items/:id', (req, res) => {
  const items = readData();
  const id = parseInt(req.params.id);
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  items[index] = { ...items[index], ...req.body };
  writeData(items);
  res.json(items[index]);
});

app.delete('/items/:id', (req, res) => {
  const items = readData();
  const id = parseInt(req.params.id);
  const updatedItems = items.filter((item) => item.id !== id);

  if (items.length === updatedItems.length) {
    return res.status(404).json({ message: 'Item not found' });
  }

  writeData(updatedItems);
  res.status(204).send();
});

// server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
