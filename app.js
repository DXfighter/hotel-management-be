const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./sequelizeConfig'); // Импорт на конфигурацията за Sequelize
const authRoutes = require('./routes/auth.js');
const Client = require('./models/Client.js');
const Room = require('./models/Room.js');



const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/client', Client);
app.use('/room', Room);

sequelize.sync({ alter: true }).then(() => {
    console.log('Базата данни и таблицата са създадени успешно.');
  }).catch((error) => {
    console.error('Грешка при създаване на базата данни и таблицата:', error);
  } );
  app.post('api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Проверка на потребителя в базата данни (заменете това със собствената логика)
      if (username === 'user' && password === 'password') {
        // Генериране на JWT токен
        // const token = jwt.sign({ user: username }, jwtSecret);
  
        // Връщане на токена и съобщение за успешен вход
        res.json({  message: 'Успешен вход' });
      } else {
        res.status(401).json({ message: 'Грешно потребителско име или парола' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Грешка при вход' });
    }
  });
app.post('/api/registerClient', async (req, res) => {
  try {
    const { name, lastName, egn, phoneNumber, email } = req.body;
    //const { name, lastName, egn, phoneNumber, email } = req.body;


    // if (!name || !lastName || !egn || !phoneNumber || !email) {
    //   return res.status(400).json({ error: 'Моля, попълнете всички полета' });
    // }

    const existingClient = await Client.findOne({
      where: {
        egn,
      },
    });

    if (existingClient) {
      return res.status(400).json({ error: 'Такъв клиент вече съществува' });
    }

    const newClient = await Client.create({
      name,
      lastName,
      egn,
      phoneNumber,
      email,
    });
    res.json(newClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Грешка при създаване на клиента' });
  }
});

app.post('/api/registerRoom', async (req, res) => {
  try {
    const { number, capacity, type, status, priceAdult, priceChaild } = req.body;

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
      status,
      priceAdult,
      priceChaild,
    });
    res.json(newRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Грешка при създаване на стаята' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


