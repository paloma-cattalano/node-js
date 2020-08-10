// Express nous permet de raccourcir le code initialement réalisé à la main dans notre 1er fichier server.js
// plus simple d'utilisation, plus court, plus clair

const express = require('express')
const bodyParser = require('body-parser')

// variable app = objet = va nous permettre d'interagir avec les requêtes de notre utilisateur
let app = express()

// la méthode use sert à configurer notre appli pour utiliser certains bouts de code spécifiques
// bodyParser va convertir toutes nos requêtes en json
app.use(bodyParser.json())
// requêtes qui utilisent la méthode http get
// 1er paramètre = l'url qu'on veut récupérer
// puis un callback qui prend notre requête et notre réponse
app.get('/contact', (req, res) => {
  res.status(200)
  // notre requête s'arrête automatiquement quand on envoie la réponse au client
  res.send('Envoyez-moi un message !')
})

app.get('/chat', (req, res) => {
  res.status(200)
  res.send('Salut Chamouraï !')
})

app.get('/', (req, res) => {
  // on récupère le body de notre parser, c'est-à-dire les données envoyées par le client
  console.log(req.body)
  // on peut aussi aller chercher un élément en particulier pour l'afficher (vu que tableau) :
  console.log(req.body.prenom)
  res.status(200)
  res.send('Bienvenue à l\'accueil')
})

app.listen(8080, () => {
  console.log('Le serveur est lancé')
})
