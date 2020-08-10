// Fichier service spécifique à la classe reservation

// on importe notre module redis :
const redis = require('redis')
const {promisify} = require('util')
// on importe d'abord client et chambre
// pour pouvoir utiliser derrière les données identifiantClient et idChambre et savoir si elles existent (fonction exists)
const clientService = require('./client')
const chambreService = require('./chambre')

const accessBdd = redis.createClient()

const {Reservation} = require('../models/reservation')


// newReservation = toutes les infos qui vont être remplies dans le formulaire
async function sendToRedis(newReservation) {
  let asyncHset = promisify(accessBdd.hset).bind(accessBdd)

// on vérifie ici le booléen renvoyé pour identifiantClient et idChambre
  if (!await clientService.exist(newReservation.identifiantClient))
    throw "Le client spécifié n'existe pas."
  if (!await chambreService.exist(newReservation.idChambre))
    throw "La chambre spécifiée n'existe pas."
  if (!await chambreService.isAvailable(newReservation.idChambre))
    throw "La chambre spécifiée est déjà réservée."


  // hset prend les paramètres qu'on lui donne dans le constructor et crée un nouvel objet (nouvel hashmap)
  // = nom de la clé des données qui seront envoyées à Redis
  return asyncHset(
    `reservation:${newReservation.numeroReservation}`,
    "numeroReservation", newReservation.numeroReservation,
    "dateEntree", newReservation.dateEntree,
    "dateSortie", newReservation.dateSortie,
    "numeroChambre", newReservation.numeroChambre,
    "numeroClient", newReservation.numeroClient,)
    // appel du callback dès que la fonction est terminée = pour dire "c'est bon c'est fini !"
    // callback = petit bonhomme qui agite un drapeau rouge 'err' si mal construit
    // ou vert pour dire tout s'est bien passé, on peut passer à autre chose
    .then((value) => {
      accessBdd.lpush("reservations", newReservation.numeroReservation)
    })
}


async function getAllFromRedis() {
  // si tu renvoies une promesse, veut dire que tu peux le rendre asynchrone
  // avec Redis > pas asynchrone. Avec express, on peut rendre asynchrone des fonctions Redis
  // en utilisant promisify
  let asyncLrange = promisify(accessBdd.lrange).bind(accessBdd)

  // on récupère la liste des IDs de nos clients avec await
  // on veut récupérer tout notre tableau donc on part du 1er élément (0) et on spécifie 1 pour dire qu'on a pas de limite
  let reservationsId = await asyncLrange("reservations", 0, -1)
  // on crée un nouveau tableau qui va contenir tous nos clients
  let reservations = []
  // on boucle sur chaque élément (les IDs) du tableau clients
  for (let id of reservationsId) {
    // pour chaque id on va chercher le client correspondant dans la bdd Redis et on l'ajoute au tableau clients
    reservations.push(Reservation.fromRedis(await getFromRedis(id)))
  }

  return reservations
}

function getFromRedis(numeroReservationBdd) {
  // on recrée leclient pour pouvoir à nouveau communiquer avec la BDD : maintenant créé une seule fois
  // let accessBdd = redis.createClient()
  let asyncHgetAll = promisify(accessBdd.hgetall).bind(accessBdd)
  return asyncHgetAll(`reservation:${numeroReservation}`)
}

// et on exporte nos fonctions pour pouvoir les utiliser partout
exports.sendToRedis = sendToRedis;
exports.getFromRedis = getFromRedis;
exports.getAllFromRedis = getAllFromRedis;
exports.exists = exists;
