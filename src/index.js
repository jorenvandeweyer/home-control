require('dotenv').config();

const express = require('express')
const metrics = require('./helpers/metrics')
const lighting = require('./lighting/index')

const app = express()

app.get('/metrics', async (req, res) => {
  metrics.metrics()
    .then(r => res.send(r))
    .catch(e => res.sendStatus(500))
})

app.listen(3000)
