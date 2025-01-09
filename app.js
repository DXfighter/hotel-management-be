const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./sequelizeConfig'); // Импорт на конфигурацията за Sequelize
const authRoutes = require('./routes/auth.js');
const Client = require('./models/Client.js');
const Room = require('./models/Room.js');
const Reservation = require('./models/Reservation.js');
const User = require('./models/User.js');
const cron = require('node-cron')
require('dotenv').config()

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/client', Client);
app.use('/room', Room);

sequelize.sync({ alter: true }).then(() => {
  console.log('Базата данни и таблицата са създадени успешно.');

  const createAdmin = async () => {
    if ( ! await User.findOne({ where: { username: 'admin' } }) ) {
      await User.create({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD,
        email: 'nobody@example.com',
        role: 'admin'
      });
    } else {
      console.log('Потребител с име admin вече съществува');
    }
  }

  createAdmin();
}).catch((error) => {
  console.error('Грешка при създаване на базата данни и таблицата:', error);
} );

app.post('/api/registerClient', async (req, res) => {
  try {
    const { name, lastName, phoneNumber, email, isAdult } = req.body;

    const existingClient = await Client.findOne({
      where: {
        email,
      },
    });

    if (existingClient) {
      return res.status(400).json({ error: 'Такъв клиент вече съществува' });
    }

    const newClient = await Client.create({
      name,
      lastName,
      phoneNumber,
      email,
      isAdult
    });

    res.json(newClient);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Грешка при създаване на клиента' });
  }
});

app.post('/api/registerRoom', async (req, res) => {
  try {
    const { number, capacity, type, priceAdult, priceChild } = req.body;

    const existingRoom = await Room.findOne({
      where: {
        number,
      },
    });

    if (existingRoom) {
      return res.status(400).json({ error: 'Такава стая вече съществува' });
    }

    const newRoom = await Room.create({
      number,
      capacity,
      type,
      priceAdult,
      priceChild,
    });
    res.json(newRoom);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Грешка при създаване на стаята' });
  }
});

app.post('/api/editRoom', async (req, res) => {
  try {
    const { number, capacity, type, priceAdult, priceChild } = req.body;

    const existingRoom = await Room.findOne({
      where: {
        number
      }
    });

    if (!existingRoom) {
      res.status(404).json({ error: 'Стаята не е намерена' });
    }

    Room.update({
      capacity,
      type,
      priceAdult,
      priceChild
    }, {
      where: {
        number
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Грешка при редактиране на стаята' });
  }
});

app.post('/api/editUser', async (req, res) => {
  try {
    const { id, username, name, middleName, lastName, egn, phoneNumber, email, startWorkDate, endWorkDate, isActive } = req.body;

    const existingUser = await User.findOne({
      where: {
        id
      }
    });

    if (!existingUser) {
      res.status(404).json({ error: 'Потребителя не е намерен' });
    }

    User.update({
      username,
      name,
      middleName,
      lastName, 
      egn,
      phoneNumber,
      email,
      startWorkDate,
      isActive,
      endWorkDate
    }, {
      where: {
        id
      }
    })
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Грешка при редактиране на потребителя' });
  }
});

const { Op } = require('sequelize');
app.post('/api/getAvailableRooms', async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Find rooms that do not have reservations overlapping with the requested dates
    const unavailableRooms = await Reservation.findAll({
      where: {
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            startDate: {
              [Op.lte]: startDate,
            },
            endDate: {
              [Op.gte]: endDate,
            },
          },
        ],
      },
      attributes: ['room'],
    });

    const unavailableRoomIds = unavailableRooms.map(reservation => reservation.room);

    // Find all rooms that are not in the unavailableRoomIds
    const availableRooms = await Room.findAll({
      where: {
        id: {
          [Op.notIn]: unavailableRoomIds,
        },
      },
    });

    res.json(availableRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching available rooms' });
  }
});
app.post('/api/createReservation', async (req, res) => {
  try {
    const { clients, room, user, includeBreakfast, allInclusive, startDate, endDate } = req.body;
    const newReservation = await Reservation.createReservation(
      room,
      user,
      clients,
      startDate,
      endDate,
      includeBreakfast,
      allInclusive
    );

    res.json(newReservation);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Грешка при създаване на резервацията' });
  }
});

app.post('/api/getRooms', async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Грешка при получаване на стаите' });
  }
});

app.post('/api/getUsers', async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        [Op.not]: {
          role: 'admin'
        }
      }
    });
    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Грешка при получаване на стаите' });
  }
});

app.post('/api/getClients', async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Грешка при получаване на клиентите' });
  }
});

app.post('/api/getReservations', async (req, res) => {
  try {
    const reservations = await Reservation.findAll({include: [Client]});

    res.json(reservations);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Грешка при получаване на резервациите' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const checkRoomAvailability = async () => {
  const rooms = await Room.findAll();
  const d = new Date();

  for ( const room of rooms ) {
    const reservation = await Reservation.findOne({
      where: {
        room: room.get('number'),
        endDate: {
          [Op.gte]: d
        },
        startDate: {
          [Op.lte]: d
        }
      }
    });

    if ( reservation ) {
      room.set('isFree', false);
    } else {
      room.set('isFree', true);
    }

    await room.save();
  }
}

cron.schedule('0 1 * * *', checkRoomAvailability);