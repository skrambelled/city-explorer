'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const superagent = require('superagent');
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

    const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json&limit=1`;

    superagent.get(url)
      .then(data => console.log(data));


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
    const weather = require('./data/weather.json');
    let days = weather.data.map(day => {
      return new Weather(day);
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
