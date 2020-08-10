// Fichier où l'on va stocker nos fonctions getFromRedis et sendToRedis
// qui servent à récupérer les données de la BDD Redis
// un dossier services dans lequel on a nos fichiers qui traitent chacun d'un service

const redis = require('redis')
// util = module de node (et non le fichier utils.js dans notre dossier)
const {promisify} = require('util')

// au lieu de créer un client à chaque fonction, on en crée un seul au début, en constante :
const accessBdd = redis.createClient()
// on pourrait aussi l'appeler clientRedis (différent de la classe Client créée pour les besoins de notre API)
const {Client} = require('../models/client')

// on veut vérifier que notre numéro chambre et notre id client existent pour boucler la résa
// pour savoir si notre résa est valide et peut être acceptée
// donc on déclare une nouvelle fonction "exists" qui appartient à node
async function exist(identifiantClient) {
  let asyncExist = promisify(accessBdd.exists).bind(accessBdd)
  // retournera simplement true ou false (existe ou non)
  return Boolean(await asyncExist(`client:${identifiantClient}`))
}


// newClientHotel = toutes les infos qui vont être remplies dans le formulaire
function sendToRedis(newClientHotel) {
  // transforme en promise ce qui n'en est pas ; bind intègre accessBdd dans la promise et le rend accessible
  // (magie noire de JS : faut le mettre pour que ça fonctionne)
  let asyncHset = promisify(accessBdd.hset).bind(accessBdd)
  // hset prend les paramètres qu'on lui donne dans le constructor et crée un nouvel objet (nouvel hashmap)
  // = nom de la clé des données qui seront envoyées à Redis
  // accessBdd.hset(
    return asyncHset (
    `client:${newClientHotel.identifiantClient}`,
    "identifiantClient", newClientHotel.identifiantClient,
    "nom", newClientHotel.nom,
    "prenom", newClientHotel.prenom,
    "adresse", newClientHotel.adresse,
    // avec le .then, on exécute ensuite la commande qui crée un tableau avec les clés de tous mes nouveaux clients enregistrés dans ma BDD Redis
    "email", newClientHotel.email,)
    .then((value) => {
      accessBdd.lpush("clients", newClientHotel.identifiantClient)
    })
}

// va me servir à récupérer tous mes clients de ma BDD Redis
// on crée une version asynchrone de la fonction lrange
async function getAllFromRedis() {
  // si tu renvoies une promesse, veut dire que tu peux le rendre asynchrone
  // avec Redis > pas asynchrone. Avec express, on peut rendre asynchrone des fonctions Redis
  // en utilisant promisify
  // bind = coupler, lier
  // crée une variable qui va récupérer un tableau de données, ici avec les données de tous nos clients
  let asyncLrange = promisify(accessBdd.lrange).bind(accessBdd)

  // on récupère la liste des IDs de nos clients avec await
  // on veut récupérer tout notre tableau donc on part du 1er élément (0) et on spécifie -1 pour dire qu'on a pas de limite
  // lrange récupère les données d'un tableau de la BDD Redis > uniquement les identifiants, pas toutes les données
  // asyncLrange = promise et pas un tableau ; await = termine de t'exécuter avant de passer à la suite du code
  let clientsId = await asyncLrange("clients", 0, -1)
  // on crée un nouveau tableau qui va contenir tous nos clients
  let clients = []
  // on boucle sur chaque élément (les IDs) du tableau clients
  // for ... in : porte sur les propriétés d'un objet qu'on lui donne
  for (let id of clientsId) {
    // pour chaque id on va chercher le client correspondant dans la bdd Redis et on l'ajoute au tableau clients
    // on clone chaque donnée récupérée dans le tableau Redis
    clients.push(Client.fromRedis(await getFromRedis(id)))
  }

  return clients
}

function getFromRedis(identifiantClient) {
  // on recrée leclient pour pouvoir à nouveau communiquer avec la BDD : maintenant créé une seule fois
  // let accessBdd = redis.createClient()
  let asyncHgetAll = promisify(accessBdd.hgetall).bind(accessBdd)
  return asyncHgetAll(`client:${identifiantClient}`)
}

exports.sendToRedis = sendToRedis;
exports.getFromRedis = getFromRedis;
exports.getAllFromRedis = getAllFromRedis;
