'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT;

app.use(cors);

app.get('/test', (req, res) => {
  res.send('hello world');
});

// default 404 error handling
app.get('*', (req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
