class Immeuble{
    constructor(addresse, appartements) {
        this.addresse = addresse
        this.appartements = appartements
    }
}

class Appartement{
    constructor(numero, prix, cuisine, bidet) {
        this.numero = numero
        this.prix = prix
        this.cuisine = cuisine
        this.bidet = bidet
    }

    static fromRedis(data){
        // cette méthode de classe permet de cloner les données d'un objet qu'on lui donne dans un nouvel objet Appartement.
        return Object.assign(new Appartement(), data)
    }
}

// on exporte notre classe Appartement afin de pouvoir l'utiliser dans d'autres modules.
exports.Appartement = Appartement
