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

async function deleteFromRedis(numeroClient) {
    // asyncLrem pour suprimer l'élément de notre tableau Clients
    let asyncLrem = promisify(accessBdd.lrem).bind(accessBdd)
    // del pour supprimer la clé de notre hashmap
    let asyncDel = promisify(accessBdd.del).bind(accessBdd)

    if (!await exist(numeroClient))
        throw "le client spécifiée n'existe pas"

    await asyncLrem("clients", 1, numeroClient)
    await asyncDel(`client:${numeroClient}`)

}

async function putToRedis(identifiantClient, updatedClient) {
    // on remplace l'intégralité des propriétés de notre objet dans notre BDD par celles de updatedClient
    // hset <clé de l'objet> <clé> <nouvelle valeur>... = mettre à jour une propriété d'un objet redis
    if (await exist(identifiantClient)) {
        for (let i in updatedClient) {
            if (updatedClient.hasOwnProperty(i)) {
                if (updatedClient[i] !== undefined) {
                    await asyncHset(`client:${identifiantClient}`, i, updatedClient[i])
                } else {
                    await asyncHset(`client:${identifiantClient}`, i, null)
                }
            }
        }
    } else {
        throw "le client n'existe pas"
    }
}

async function patchToRedis(identifiantClient, updatedClient) {
    // on boucle uniquement sur les propriétés déclarée de notre objet dans notre BDD par celles de updatedClient
    let asyncHset = promisify(accessBdd.hset).bind(accessBdd)
    if (await exist(identifiantClient)) {
        for (let i in updatedClient) {
            if (updatedClient.hasOwnProperty(i)) {
                if (updatedClient[i] !== undefined) {
                    await asyncHset(`client:${identifiantClient}`, i, updatedClient[i])
                }
            }
        }
    } else {
        throw "le client n'existe pas"
    }
}

async function exist(identifiantClient) {
    let asyncExist = promisify(accessBdd.exists).bind(accessBdd)

    return Boolean(await asyncExist(`client:${identifiantClient}`))
}

async function getAllFromRedis(queryParameters) {
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

    //effectuer un traitement pour appliquer nos filtres
    for (let filter in queryParameters) {
        if (queryParameters.hasOwnProperty(filter))
            clients = clients.filter((client) => client[filter] === queryParameters[filter])
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
exports.exist = exist
exports.deleteFromRedis = deleteFromRedis
exports.putToRedis = putToRedis
exports.patchToRedis = patchToRedis
