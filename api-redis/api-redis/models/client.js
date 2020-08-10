class Client {
    constructor(identifiantClient, nom, prenom, addresse, email) {
        this.identifiantClient = identifiantClient
        this._nom = nom
        this._prenom = prenom
        this._addresse = addresse
        this._email = email
    }

    static fromRedis(data) {
        return Object.assign(new Client(), data)
    }

    set nom(value){
      if (typeof value === "string")
      this._nom = value
      else{
        "La valeur doit être en lettres"
      }
    }

    get nom(){
      return this._nom
    }

}


exports.Client = Client
