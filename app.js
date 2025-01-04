const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./sequelizeConfig'); // Импорт на конфигурацията за Sequelize
const authRoutes = require('./routes/auth.js');
// const User = require('./models/User ');
const clientRoutes = require('./models/Client.js');



const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/client', clientRoutes);

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
  app.post('/api/client', async (req, res) => {
    try {
      const { name, lastName, egn, phoneNumber, email } = req.body;

      // Проверка дали клиент с тези данни вече съществува
      const existingClient = await Client.findOne({
        where: {
          egn: egn,
          phoneNumber: phoneNumber,
          email: email,
        }
      });

      if (existingClient) {
        return res.status(400).json({ message: 'Клиент с тези данни вече съществува' });
      }

      // Създаване на нов клиент в базата данни
      const newClient = await Client.createClient(name, lastName, egn, phoneNumber, email);
      res.status(201).json({ message: 'Регистрацията беше успешна' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Грешка при регистрация' });
    }
  });
  app.get('/api/client', async (req, res) => {
    try {
      const clients = await Client.findAll();
      res.json(clients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
