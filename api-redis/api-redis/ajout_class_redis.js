const {Chambre} = require('./models/chambre')
const {Client} = require('./models/client')
const {Reservation} = require('./models/reservation')
const utils = require('./utils')
const serviceClient = require('./services/client')

let clientHotel = new Client(utils.uuidv4(), 'lelu', 'awenn', '11 rue charle de gaulle', 'test@test.test')
console.log(clientHotel)
serviceClient.sendToRedis(clientHotel)

serviceClient.getFromRedis(clientHotel.identifiantClient, (err, res) => {
    let clientHotel = Client.fromRedis(res)
})
