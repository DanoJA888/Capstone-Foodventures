import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Favorite = sequelize.define('Favorite', {
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recipeName: {
    type: DataTypes.STRING,
    allowNull: false
  }
});