const redis = require('redis')
const {promisify} = require('util')
const accessBdd = redis.createClient()
const {Client} = require('../models/client')

function sendToRedis(clientHotel) {
    let asyncHset = promisify(accessBdd.hset).bind(accessBdd)
    return asyncHset(`client:${clientHotel.identifiantClient}`,
        "identifiantClient", clientHotel.identifiantClient,
        "nom", clientHotel.nom,
        "prenom", clientHotel.prenom,
        "addresse", clientHotel.addresse,
        "email", clientHotel.email).then((value) => {
        accessBdd.lpush("clients", clientHotel.identifiantClient)
    })
}


async function getAllFromRedis() {
    // on créer une version asyncrone de la fonction lrange
    let asyncLrange = promisify(accessBdd.lrange).bind(accessBdd)

    // on récupère la liste des IDs de nos clients avec await
    let clientsId = await asyncLrange("clients", 0, -1)
    // on créer un nouveau tableau qui vas contenenir nos clients
    let clients = []
    // on boucle sur chaque élément (les IDs) du tableau clients
    for (let id of clientsId) {
        // pour chaque id, on vas cherche le client correspondant dans redis et on l'ajoute au tableau clients
        clients.push(Client.fromRedis(await getFromRedis(id)))
    }

    return clients
}

function getFromRedis(identifiantClient) {
    let asyncHgetAll = promisify(accessBdd.hgetall).bind(accessBdd)
    return asyncHgetAll(`client:${identifiantClient}`)
}

exports.sendToRedis = sendToRedis
exports.getFromRedis = getFromRedis
exports.getAllFromRedis = getAllFromRedis
