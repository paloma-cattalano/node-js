class Client {
    constructor(identifiantClient, nom, prenom, addresse, email) {
        this.identifiantClient = identifiantClient
        this._nom = nom
        this._prenom = prenom
        this.addresse = addresse
        this.email = email
    }

    static fromRedis(data) {
        return Object.assign(new Client(), data)
    }

    set nom(value) {
        if (typeof value === "string")
            this._nom = value
        else {
            throw "la valeur de la propriété 'nom' doit toujours être une chaîne de caractère."
        }
    }

    get nom() {
        return this._nom
    }

    set prenom(value) {
        if (typeof value === "string")
            this._prenom = value
        else {
            throw "la valeur de la propriété 'prenom' doit toujours être une chaîne de caractère."
        }
    }

    get prenom() {
        return this._prenom;
    }


}

exports.Client = Client
