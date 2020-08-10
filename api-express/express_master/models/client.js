class Client {
    constructor(identifiantClient, nom, prenom, addresse, email) {
        this.identifiantClient = identifiantClient
        this.nom = nom
        this.prenom = prenom
        this.addresse = addresse
        this.email = email
    }

    static fromRedis(data) {
        return Object.assign(new Client(), data)
    }

}

exports.Client = Client
