const express = require('express');
const router = express.Router();
const RegisteredUser = require('../models/User.js');

// Маршрут за регистрация на нов потребител
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверка дали потребител с този потребителско име вече съществува
    const existingUser = await RegisteredUser.findOne({
      where: {
        username: username
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Потребител с това име вече съществува' });
    }

    // Създаване на нов потребител в базата данни
    const newUser = await RegisteredUser.createUser(username, password);

    res.status(201).json({ message: 'Регистрацията беше успешна' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Грешка при регистрация' });
  }
});

module.exports = router;