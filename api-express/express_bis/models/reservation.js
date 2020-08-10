class Reservation {
  constructor(numeroReservation, dateEntree, dateSortie, numeroChambre, numeroClient) {
    this.numeroReservation = numeroReservation;
    this.dateEntree = dateEntree;
    this.dateSortie = dateSortie;
    this.numeroChambre = numeroChambre;
    this.numeroClient = numeroClient;
  }

  static fromRedis(data) {
    return Object.assign(new Reservation(), data)
  }
}

exports.Reservation = Reservation
