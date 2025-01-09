const express = require('express');
const router = express.Router();
const RegisteredUser = require('../models/User.js');

router.post('/register', async (req, res) => {
  try {
    const { username, password, name, middleName, lastName, egn, phoneNumber, email, startWorkDate, isActive} = req.body;

    const existingUser = await RegisteredUser.findOne({
      where: {
        username: username
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Потребител с това име вече съществува' });
    }

    const newUser = await RegisteredUser.createUser(username, password, name, middleName, lastName, egn, phoneNumber, email, startWorkDate, isActive);

    res.status(201).json({ message: 'Регистрацията беше успешна' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Грешка при регистрация' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await RegisteredUser.findOne({
      where: {
        username: username,
        password: password,
        isActive: true
      }
    });

    if (user) {
      res.status(200).json({ message: 'Успешен вход', user: user.get('id'), role: user.get('role') });
    } else {
      res.status(401).json({ message: 'Грешно потребителско име или парола' });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Грешка при вход' });
  }
});

module.exports = router;