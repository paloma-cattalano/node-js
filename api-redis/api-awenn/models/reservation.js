class Reservation {
    constructor(numeroReservation, dateEntree, dateSortie, identifiantChambre, identifiantClient) {
        this.numeroReservation = numeroReservation
        this.dateEntree = dateEntree
        this.dateSortie = dateSortie
        this.identifiantChambre = identifiantChambre
        this.identifiantClient = identifiantClient
    }
}

exports.Reservation = Reservation
