// ce fichier contient juste la class client déclarée

class Client {
  constructor(identifiantClient, nom, prenom, adresse, email) {
    this._identifiantClient = identifiantClient;
    this._nom = nom;
    this._prenom = prenom;
    this._adresse = adresse;
    this._email = email;
  }

// permet de cloner un objet qu'on reçoit, n'a pas besoin d'accéder à la BDD,
// est spécifique à notre class Client
  static fromRedis(data) {
    return Object.assign(new Client(), data)
  }

// pour vérifier le type de données reçue, on utilise des getter et setter
// on ajoute des _ >> propriétés privées, donc on évite de travailler dessus ensuite = on y touche plus
  set nom(value) {
    if (typeof value === "string") {
      // je convertis d'abord ma valeur reçue en String
      // avant de l'affecter / l'attribuer à this._nom
      this._nom = value
    }
    else {
      throw "la valeur de la propriété 'nom' doit toujours être une chaîne de caractères"
    }
  }

  get nom() {
    return this._nom
  }

  set prenom(value) {
    if (typeof value === "string") {
      this._prenom = value
    }
    else {
      throw "la valeur de la propriété 'prénom' doit toujours être une chaîne de caractères"
    }
  }

  get prenom() {
    return this._prenom
  }

  set adresse(value) {
    if (typeof value === "string") {
      this._adresse = value
    }
    else {
      throw "la valeur de la propriété 'adresse' doit toujours être une chaîne de caractères"
    }
  }

  get adresse() {
    return this._adresse
  }

  set email(value) {
    if (typeof value === "string") {
      // je convertis d'abord ma valeur reçue en String
      // avant de l'affecter / l'attribuer à this._nom
      this._email = value
    }
    else {
      throw "la valeur de la propriété 'email' doit toujours être une chaîne de caractères"
    }
  }

  get email() {
    return this._email
  }
}

exports.Client = Client
