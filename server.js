'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const superagent = require('superagent');
const cors = require('cors');

const PORT = process.env.PORT;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
const TRAIL_API_KEY = process.env.TRAIL_API_KEY;

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(cors());

function Location(city, geoData) {
  this.search_query = city;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
  this.formatted_query = geoData.display_name;
}

function sendError(res, code, message) {
  res.json({
    status: code,
    resonseText: message
  })
}

app.get('/location', (req, res) => {
  try {
    const city = req.query.city;
    const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json&limit=1`;

    superagent.get(url)
      .then(data => {
        const geoData = data.body[0];
        const locationData = new Location(city, geoData);
        res.json(locationData);
      })
      .catch(error => sendError(res, 500, error));

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
    const lat = req.query.latitude;
    const lon = req.query.longitude;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHERBIT_API_KEY}&lat=${lat}&lon=${lon}&days=8`

    superagent.get(url)
      .then(data => {
        const weatherForecast = data.body.data;
        let weatherData = weatherForecast.map(day => new Weather(day));
        res.send(weatherData);
      })
      .catch(error => sendError(res, 500, error));
  } catch (error) {
    sendError(res, 500, 'Weather Error');
  }
});

function Trail(trail) {
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.trail_url = trail.url;
  this.conditions = trail.conditionStatus;
  this.condition_date = trail.conditionDate.split(' ')[0];
  this.condition_time = trail.conditionDate.split(' ')[1];
}

app.get('/trails', (req, res) => {
  try {
    const lat = req.query.latitude;
    const lon = req.query.longitude;

    const url = `https://hikingproject.com/data/get-trails?key=${TRAIL_API_KEY}&lat=${lat}&lon=${lon}&maxDistance=200`;

    return superagent.get(url)
      .then(data => {
        const trails = data.body.trails;
        let trailData = trails.map(trail => new Trail(trail));
        res.send(trailData);
      })
      .catch(error => sendError(res, 500, error));

  } catch (error) {
    sendError(res, 500, 'Trail Error');
  }
});

// default 404 error handling
app.get('*', (req, res) => {
  sendError(res, 404, 'Page not found.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
