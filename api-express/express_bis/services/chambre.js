// Fichier service spécifique à la classe Chambre

// on importe notre module redis :
const redis = require('redis')
const {promisify} = require('util')
const accessBdd = redis.createClient()

const {Chambre} = require('../models/chambre')

// je vérifie si l'Id Chambre existe pour pouvoir me servir de la réponse dans services/reservation
async function exist(idChambre) {
  let asyncExist = promisify(accessBdd.exists).bind(accessBdd)
  // retournera simplement true ou false (existe ou non)
  return Boolean(await asyncExist(`chambre:${idChambre}`))
}

// je vérifie ici si la chambre est dispo
async function isAvailable(idChambre) {
  // je promisifie : permet de récupérer juste ce qui nous intéresse avec le hget
  let asyncHget = promisify(accessBdd.hget).bind(accessBdd)

// si l'id chambre n'existe pas, renvoie un message d'erreur
  if (!await exist(idChambre))
    throw "La chambre demandée n'existe pas."
// si existe, renvoie le booléen 'est dispo' avec l'id chambre
  return Boolean(await asyncHget(`chambre:${idChambre}`, 'estDisponible'))
}

// newChambre = toutes les infos qui vont être remplies dans le formulaire
function sendToRedis(newChambre) {
  let asyncHset = promisify(accessBdd.hset).bind(accessBdd)
  // let accessBdd = redis.createClient()
  // hset prend les paramètres qu'on lui donne dans le constructor et crée un nouvel objet (nouvel hashmap)
  // = nom de la clé des données qui seront envoyées à Redis
  return asyncHset(
    `chambre:${newChambre.idChambre}`,
    "idChambre", newChambre.idChambre,
    "prix", newChambre.prix,
    "nbLits", newChambre.nbLits,
    "possedeSalleDeBain", newChambre.possedeSalleDeBain,
    "balcon", newChambre.balcon,
    "terrasse", newChambre.terrasse,
    "clim", newChambre.clim,
    "tele", newChambre.tele,
    "petitDejeuner", newChambre.petitDejeuner,
    "prixPetitDejeuner", newChambre.prixPetitDejeuner,
    "accepteAnimaux", newChambre.accepteAnimaux,
    "accepteEnfants", newChambre.accepteEnfants,
    "etage", newChambre.etage,
    "estDisponible", newChambre.estDisponible,
    "litKingSize", newChambre.litKingSize,
    "optionPetaleDeRoses", newChambre.optionPetaleDeRoses,)
    // appel du callback dès que la fonction est terminée = pour dire "c'est bon c'est fini !"
    // callback = petit bonhomme qui agite un drapeau rouge 'err' si mal construit
    // ou vert pour dire tout s'est bien passé, on peut passer à autre chose
    .then((value) => {
      accessBdd.lpush("chambres", newChambre.idChambre)
    })
}

async function getAllFromRedis() {
  // si tu renvoies une promesse, veut dire que tu peux le rendre asynchrone
  // avec Redis > pas asynchrone. Avec express, on peut rendre asynchrone des fonctions Redis
  // en utilisant promisify
  let asyncLrange = promisify(accessBdd.lrange).bind(accessBdd)

  // on récupère la liste des IDs de nos clients avec await
  // on veut récupérer tout notre tableau donc on part du 1er élément (0) et on spécifie 1 pour dire qu'on a pas de limite
  let chambresId = await asyncLrange("chambres", 0, -1)
  // on crée un nouveau tableau qui va contenir tous nos clients
  let chambres = []
  // on boucle sur chaque élément (les IDs) du tableau clients
  for (let id of chambresId) {
    // pour chaque id on va chercher le client correspondant dans la bdd Redis et on l'ajoute au tableau clients
    chambres.push(Chambre.fromRedis(await getFromRedis(id)))
  }

  return chambres
}

function getFromRedis(idChambreBdd) {
  // on recrée leclient pour pouvoir à nouveau communiquer avec la BDD : maintenant créé une seule fois
  // let accessBdd = redis.createClient()
  let asyncHgetAll = promisify(accessBdd.hgetall).bind(accessBdd)
  return asyncHgetAll(`chambre:${idChambre}`)
}

// et on exporte nos fonctions pour pouvoir les utiliser partout
exports.sendToRedis = sendToRedis
exports.getFromRedis = getFromRedis
exports.getAllFromRedis = getAllFromRedis
exports.exist = exist
exports.isAvailable = isAvailable
