const express = require('express');
const router = express.Router();
const RegisteredUser = require('../models/User.js');

// Маршрут за регистрация на нов потребител
router.post('/register', async (req, res) => {
  try {
    const { username, password,name, middleName, lastName } = req.body;

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
    const newUser = await RegisteredUser.createUser(username, password,name, middleName, lastName);

    res.status(201).json({ message: 'Регистрацията беше успешна' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Грешка при регистрация' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверка в базата данни дали има потребител с това потребителско име и парола
    const user = await RegisteredUser.findOne({
      where: {
        username: username,
        password: password // Предполагаме, че паролата се съхранява в хеширан вид в базата данни
      }
    });

    if (user) {
      // Генерирайте JWT токен
      // const token = generateJWTToken(user.id);

      // Влизане успешно - върнете статус 200, JWT токен и съобщение за успешен вход
      res.status(200).json({ message: 'Успешен вход' });
    } else {
      // Невалидни данни за вход - върнете статус 401 и съобщение за грешка
      res.status(401).json({ message: 'Грешно потребителско име или парола' });
    
    
    }
  } catch (error) {
    console.error(error);
    // Грешка при обработка на заявката - върнете статус 500 и съобщение за грешка
    res.status(500).json({ error: 'Грешка при вход' });
  }
});


module.exports = router;