const express = require('express') // on importe le module express
const bodyParser = require('body-parser')
const clientService = require('./services/client')
const {Client} = require('./models/client') //pas fini

let app = express()// on crée une nouvelle application express

app.use(bodyParser.json()) // use configure les comportements spécifiques de l'appli


app.get('/', (req, res) => {// on déclare une route '/' qui va juste renvoyer "hello" sous forme de texte
    // console.log(req.body)
    // console.log(req.body.occupations)
    res.status(200)
    res.send("Bienvenue à l'acceuil ! Que puis-je faire pour vous ?")
})

app.post('/client', async (req, res) => {
    let newClient = Client.fromRedis(req.body)
    await clientService.sendToRedis(newClient)
    res.status(200)
    res.json()
})

app.listen(8080, () => {// on lance notre serveur sur le port 8080
    console.log("serveur lancé !")
})



// redis-server
