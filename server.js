const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  logging: false,
});

const Point = sequelize.define('Point', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coordinates: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

sequelize.sync();

app.post('/api/points', async (req, res) => {
  try {
    const { name, coordinates } = req.body;
    const newPoint = await Point.create({ name, coordinates });
    res.status(201).json(newPoint);
  } catch (error) {
    res.status(500).json({ error: 'Veri eklenirken hata oluştu.' });
  }
});

app.get('/api/points', async (req, res) => {
  try {
    const points = await Point.findAll();
    res.status(200).json(points);
  } catch (error) {
    res.status(500).json({ error: 'Veriler alınırken hata oluştu.' });
  }
});

app.put('/api/points/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, coordinates } = req.body;

    const point = await Point.findByPk(id);
    if (!point) {
      return res.status(404).json({ error: 'Veri bulunamadı.' });
    }

    point.name = name;
    point.coordinates = coordinates;
    await point.save();

    res.status(200).json(point);
  } catch (error) {
    res.status(500).json({ error: 'Veri güncellenirken hata oluştu.' });
  }
});

app.delete('/api/points/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const point = await Point.findByPk(id);
    if (!point) {
      return res.status(404).json({ error: 'Veri bulunamadı.' });
    }

    await point.destroy();
    res.status(200).json({ message: 'Veri başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ error: 'Veri silinirken hata oluştu.' });
  }
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
