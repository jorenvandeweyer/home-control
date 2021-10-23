import express from 'express'
import metrics from './helpers/metrics'
import sma from './helpers/sma'
import './lighting/index'

require('dotenv').config()

const app = express()

app.get('/metrics', async (req, res) => {
  await sma.updateMetrics().catch(e => {})

  metrics.metrics()
    .then(r => res.send(r))
    .catch(e => res.sendStatus(500))
})

app.listen(3000)
