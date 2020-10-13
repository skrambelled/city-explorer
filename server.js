'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(cors());

function Location(city, geoData) {
  this.search_query = city;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
  this.formatted_query = geoData[0].display_name;
}

app.get('/location', (req, res) => {
  try {
    const geoData = require('./data/location.json');
    const city = req.query.city;
    const locationData = new Location(city, geoData);
    res.json(locationData);
  } catch (error) {
    res.status(500).send('Error');
  }
});

app.get('/weather', (req, res) => {

});

// default 404 error handling
app.get('*', (req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
