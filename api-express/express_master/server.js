const express = require('express')
const bodyParser = require('body-parser')
const clientService = require('./services/client')
const reservationService = require('./services/reservation')
const {Client} = require('./models/client')
const {Reservation} = require('./models/reservation')
const {uuidv4} = require('./utils')

let app = express()

app.use(bodyParser.json())

// Client => Middleware => Serveur => Code
// Code => Serveur => Middleware => Client

app.get('/client', async (req, res) => {
    res.status(200)
    res.json(await clientService.getAllFromRedis(req.query))
})

app.get('/client/:identifiantClient', async (req, res) => {
    if (req.params.identifiantClient === true) {
        res.status(200)
        // on appel la méthode getFromRedis du service clientService afin de récupérer les données d'un client précis
        // de notre base de donnée.
        res.json(await clientService.getFromRedis(req.params.identifiantClient))
    } else {
        res.status(400)
        res.json({"erreur": "paramètre identifiantClient invalide"})
    }
})

app.post('/client', async (req, res) => {
    let newClient = Client.fromRedis(req.body)
    newClient.identifiantClient = uuidv4()

    await clientService.sendToRedis(newClient)
    res.status(200)
    res.json(newClient)
})

app.delete('/client', (req, res) => {
    res.status(400)
    res.json({"error": "paramètre identifiant client non spécifié (ex: delete http://localhost/client/e94c0559-79f2-4e43-9781-22daec0b03ff)"})
})

app.put('/client/:identifiantClient', async (req, res) => {
    if (!req.params.identifiantClient)
        // on vérifie que le paramètre dynamique est bien passé
        throw "le paramètre dynamique :identifiantClient est requis."
    try {
        // on exécute de façon syncrone (dans une fonction asyncrone) notre fonction putToRedis
        await clientService.putToRedis(Client.fromRedis(req.body))
        // on renvoie une message comme quoi tout c'est bien passé
        req.json({'status': 'OK'})
    } catch (e) {
        // sinon on balance l'erreur.
        res.status(401)
        res.json({'error': e})
    }
})

app.patch('/client/:identifiantClient', async (req, res) => {
    if (!req.params.identifiantClient)
        throw "le paramètre dynamique :identifiantClient est requis."
    try {
        await clientService.patchToRedis(Client.fromRedis(req.body))
        req.json({'status': 'OK'})
    } catch (e) {
        res.status(401)
        res.json({'error': e})
    }
})

app.delete('/client/:identifiantClient', async (req, res) => {
    let idClientEnvoye = req.params.identifiantClient

    if (idClientEnvoye === false) {
        res.status(400) // n'arrête pas le prog donc else
        res.json({"erreur": "pas de donnée à traiter"}) // correspondance clé-valeur / entre {} = déclare un objet
    } else {
        try {
            await clientService.deleteFromRedis(idClientEnvoye)
            res.json() // met automatiquement un status 200
        } catch (e) {
            res.status(400)
            res.json({"erreur": e})
        }
    }
})

app.post('/reservation', async (req, res) => {
    let newReservation = Reservation.fromRedis(req.body)
    newReservation.numeroReservation = uuidv4()

    try {
        await reservationService.sendToRedis(newReservation)
        res.status(200)
        res.json(newReservation)
    } catch (e) {
        res.status(400)
        res.json({"erreur": e})
    }
})

app.listen(8080, () => {
    console.log("serveur lancé")
})
