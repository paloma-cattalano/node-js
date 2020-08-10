const express = require('express')
// module bodyParser appartient à Express et récupère les données client et les transforme les requêtes en json
// une requête = un paquet / plusieurs petits paquets sont envoyés au serveur et constituent la requête "globale"
// bodyParser reconstitue la requête "globale" et la traduit en json (= un middleware = un programme qui intervient sur ttes les requêtes = un bout de code JS)
// intervient entre l'envoi de la donnée par l'API et l'arrivée sur le serveur. Intervient à l'aller et au retour.
const bodyParser = require('body-parser')

// API = une interface entre 2 choses qui ne sont pas censées se parler au départ...
// permet de filtrer les données et les utilisateurs et donc de sécuriser les données, mais aussi de les protéger contre certains utilisateurs
// c'est le rôle du middleware de vérifier si la requête envoyée a le droit d'être faite
// auth token = jeton d'authentification
// Erreur 403 = non autorisé à accéder à cette ressource > le serveur a compris la requête mais refuse de l'exécuter (il y a token mais est invalide)
// Erreur 401 = requête envoyée mais il n'y a pas de donnée suffisante pour vérifier l'identité de l'utilisateur


const clientService = require('./services/client')
const resaService = require('./services/reservation')
const chambreService = require('./services/chambre')
// {} notre model Client exporte la class client (cf models/client > fin)
// je veux importer juste ma classe client à partir de mon model client
const {Client} = require('./models/client')
const {Reservation} = require('./models/reservation')
const {Chambre} = require('./models/chambre')

const {uuidv4} = require('./utils')

let app = express()

// ici on transforme toutes les données en json
// on dit à notre appli d'utiliser le middleware bodyParser et de traduire les données reçues en json :
// au retour, transformera la réponse renvoyée en chaîne de caractères (tout seul comme un grand, pas la peine de lui préciser)
app.use(bodyParser.json())
// ça peut être une autre méthode : .xml, .txt, .raw (donnée récupérée en buffer)... .json le plus utilisé
// buffer = body à l'état pur donc en binaire, sans qu'aucun traitement n'ait été appliqué dessus
// différent de baked

// ==========================================
// pour client :

// ici se crée le nouveau client dans notre BDD à partir des données saisies sur la page /client
app.post('/client', async (req, res) => {
  // req.body : on récupère le body de notre parser, c'est-à-dire les données envoyées par le client
  let donneesFormulaire = req.body
  // là on regroupe les données selon le modèle de l'objet Client (models/client.js) > on façonne la structure
  let newClient = Client.fromRedis(req.body) // ici je crée notre nouvel objet JS
  newClient.identifiantClient = uuidv4() // ici j'attribue un identifiant aléatoire à mon nouveau client
  console.log(newClient) // pour vérif si fonctionne = si données bien construites selon le modèle

  // await pour que notre promise soit exécutée de façon synchrone
  // là les données sont envoyées sur la BDD Redis
  await clientService.sendToRedis(newClient)
  res.status(200)
  // notre requête s'arrête automatiquement quand on envoie la réponse au client
  // toute requête envoyée doit renvoyer une réponse derrière donc :
  res.json(newClient)

})

// affiche la page /client sur laquelle on va retrouver le tableau en json avec tous mes clients
// get = demande à ta BDD d'envoyer des infos
// post = demande d'inscrire dans ta BDD un nouvel élément (ici nouveau client)
app.get('/client', async (req, res) => {
  res.status(200)
  // notre requête s'arrête automatiquement quand on envoie la réponse au client
  // await = ce bout de code doit être exécuté jusqu'au bout (donc pas asynchrone)
  res.json(await clientService.getAllFromRedis())
})


// ==========================================
// pour reservation :

app.get('/reservation', async (req, res) => {
  res.status(200)
  res.json(await resaService.getAllFromRedis())
})

app.post('/reservation', async (req, res) => {
  let newReservation = Reservation.fromRedis(req.body)
  newReservation.numeroReservation = uuidv4()
  console.log(newReservation) // pour vérif si fonctionne

// ici on lui dit de tester la réponse avant d'exécuter avec try et catch
  try {
    res.status(200)
    res.json(newReservation)
    await reservationService.sendToRedis(newReservation)
    // si plante, va prendre le message d'erreur défini dans services/reservation
    // if/throw communique avec try/catch
  } catch (error) {
    res.status(400)
    res.json({"erreur": error})
  }

  await resaService.sendToRedis(newReservation)
  res.status(200)
  res.json()
})

// ==========================================
// pour chambre :

app.get('/chambre', async (req, res) => {
  res.status(200)
  res.json(await chambreService.getAllFromRedis())
})

app.post('/chambre', async (req, res) => {
  let newChambre = Chambre.fromRedis(req.body)
  newChambre.idChambre = uuidv4()
  console.log(newChambre) // pour vérif si fonctionne

  await chambreService.sendToRedis(newChambre)
  res.status(200)
  res.json()
})


// ==========================================
// appel du port 8080
app.listen(8080, () => {
  console.log('Le serveur est lancé')
})
