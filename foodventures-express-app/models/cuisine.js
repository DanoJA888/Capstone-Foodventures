import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Cuisine = sequelize.define('Cuisine', {
  cuisineName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cusineCode: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});