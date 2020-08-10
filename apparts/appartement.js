// on importe le module Redis qui vas nous permettre d'interagire avec notre base
// de donnée depuis notre code javascript.
const redis = require("redis");
// on importe aussi la classe Appartement depuis notre module immeuble.
const {Appartement} = require("./immeuble");

// on créer ensuite un client redis qui vas se connecter à notre base de donnée
// en local et on le stock dans une variable.
const client = redis.createClient()

// on commence par récupérer l'addresse de l'immeuble qui est stocké sur la
// clé "immeuble", pour cela, on utilise la méthode client.get
// on passe en paramètre de la méthode la clé que l'on souhaite récupérer,
// puis une fonction de callback qui sera appelée une fois l'exécution de notre
// méthode client.get terminée.
// cette callback prend 2 paramètre, l'éventuelle erreur rencontrée et la réponse
// de la base de donnée.
// ces paramètres serons passé automatiquement par la méthode client.get une fois
// celle-ci terminée.
client.get("immeuble", (err, res) => {
    let addresseImmeuble = res
    console.log(addresseImmeuble)
})

// on vas ensuite récupérer le tableau qui stock tout nos appartements et qui
// se situe à la clé "immeuble:appartement"
// étant donné que la clé est un tableau, on vas utiliser la méthode lrange
// qui vas prendre en paramètre la clé à récupérer,
// l'index de départ, l'index de fin (ici -1 car on récupère tout le tableau)
// et une callback
client.lrange("immeuble:appartement", 0, -1, (err, res) => {
    let appartements = res
    console.log(appartements)

    // on vas ensuite récupérer le détail de chaque appartement à partir des
    // clés récupérer précédement dans notre tableau.
    for (const appartement of appartements) {
        // on vas utiliser la méthode client.hgetall à laquelle on passe la
        // clé de chaque appartement afin de récupérer un objet
        // contenant toutes les clé/valeur.
        client.hgetall(appartement, (err, res) => {
            console.log(res)
            // on utilise ensuite la méthode fromREdis de la classe Appartement
             // afin de cloner les données de notre objet redis dans
            // un nouvel objet appartement.
            let appartement = Appartement.fromRedis(res)
            console.log(appartement)
            // on peut ensuite utiliser la méthode JSON.stringify sur notre
            // objet appartement afin de le convertire en une chaîne de caractère Json.
            console.log(JSON.stringify(appartement))
        })
    }
})
