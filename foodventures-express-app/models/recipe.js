import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Recipe = sequelize.define('Recipe', {
  recipeName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recipeSource: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ingredientLines: {
    type: DataTypes.ARRAY,
    allowNull: false,
  },
  directions: {
    type: DataTypes.ARRAY,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  servings: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cuisine: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});