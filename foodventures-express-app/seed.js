import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './database.js';
import { Cuisine } from './models/cuisine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cuisineData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './seeders/cuisine.json'), 'utf8'));

const seedDatabase = async () => {
  try {
    // Sync all models that aren't already in the database
    await sequelize.sync({ alter: true });

    // Then seed the User and Post data
    await Cuisine.bulkCreate(cuisineData);
    console.log('Cuisine data has been seeded!');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();