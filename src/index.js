require('dotenv').config();

const express = require('express')
const metrics = require('./helpers/metrics')
const lighting = require('./lighting/index')

const app = express()

app.get('/metrics', async (req, res) => {
  try {
    const result = await metrics.metrics()
    res.send(result)
  } catch (e) {
    res.sendStatus(500)
  }

})

app.listen(3000)
