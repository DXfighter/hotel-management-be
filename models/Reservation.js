// models/Reservation.js

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConfig');
const Room = require('./Room');
const Client = require('./Client');
const User = require('./User');

const Reservation = sequelize.define("reservation", {
    startDate: {
        type: DataTypes.DATE,
    },
    endDate: {
        type: DataTypes.DATE,
    },
    includeBreakfast: {
        type: DataTypes.BOOLEAN
    },
    allInclusive: {
        type: DataTypes.BOOLEAN
    },
    price: {
        type: DataTypes.FLOAT
    }
},
{
    tableName: 'reservations',
    timestamps: false
});

Room.hasMany(Reservation, { foreignKey: 'room' });
User.hasMany(Reservation, { foreignKey: 'user' });
Client.belongsToMany(Reservation, { through: 'client_reservation', timestamps: false });
Reservation.belongsToMany(Client, { through: 'client_reservation', timestamps: false });

Reservation.createReservation = async function (room, user, clients, startDate, endDate, includeBreakfast, allInclusive) {
    try {
        const reservation = await this.create({
            room,
            user,
            startDate,
            endDate,
            includeBreakfast,
            allInclusive
        });

        const clientInstances = await Promise.all(clients.map(async client => await Client.findByPk(client)));

        await reservation.setClients(clientInstances);
        // for ( const clientInstance of clientInstances ) {
        //     await ClientReservation.create({ reservationId: reservation.get('id'), clientId: clientInstance.get('id') });
        // }

        const roomInstance = await Room.findByPk(room);

        const timeDiff = new Date(endDate).getTime() - new Date(startDate).getTime();

        const days = Math.round(timeDiff / (1000 * 3600 * 24));

        const price = 
            (roomInstance.get('priceAdult') * clientInstances.filter(client => client.get('isAdult')).length 
            + roomInstance.get('priceChild') * clientInstances.filter(client => !client.get('isAdult')).length
            + roomInstance.get('priceAdult') * 0.25 * includeBreakfast
            + roomInstance.get('priceAdult') * 0.5 * allInclusive)
            * (days + 1);

        reservation.set('price', price);

        await reservation.save();
        
        return reservation;
    } catch (error) {
        throw error;
    }
};

module.exports = Reservation;