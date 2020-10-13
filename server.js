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

function sendError(res, code, message) {
  res.json({
    status: code,
    resonseText: message
  })
}

app.get('/location', (req, res) => {
  try {
    const geoData = require('./data/location.json');
    const city = req.query.city;
    const locationData = new Location(city, geoData);
    res.json(locationData);
  } catch (error) {
    sendError(res, 500, 'Location error');
  }
});

function Weather(day) {
  this.forecast = day.weather.description;
  this.time = day.valid_date;
}

app.get('/weather', (req, res) => {
  try {
    let days = [];
    const weather = require('./data/weather.json');
    weather.data.forEach(day => {
      days.push(new Weather(day));
    });
    res.send(days);
  } catch (error) {
    sendError(res, 500, 'Weather Error');
  }
});

// default 404 error handling
app.get('*', (req, res) => {
  sendError(res, 404, 'Page not found.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
