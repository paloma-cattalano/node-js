const express = require('express')
const bodyParser = require('body-parser')
const clientService = require('./services/client')
const {Client} = require('./models/client')
const {uuidv4} = require('./utils')

let app = express()

app.use(bodyParser.json())

// Client => Middleware => Serveur => Code
// Code => Serveur => Middleware => Client

app.get('/client', async (req, res) => {
    res.status(200)
    res.json(await clientService.getAllFromRedis())
})

app.post('/client', async (req, res) => {
    let newClient = Client.fromRedis(req.body)
    newClient.identifiantClient = uuidv4()
    console.log(newClient)

    await clientService.sendToRedis(newClient)
    res.status(200)
    res.json()
})

app.listen(8080, () => {
    console.log("serveur lancé")
})
