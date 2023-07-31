import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';
import { User } from './user.js';

export const Recipe = sequelize.define('Recipe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recipeId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cuisine: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  /*
  recipeName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recipeSource: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ingredientLines: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    allowNull: false,
  },
  directions: {
    type: DataTypes.STRING,
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
  
  */
  recipe :{
    type: DataTypes.JSONB,
    allowNull: false
  }
});

Recipe.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Recipe, { foreignKey: 'userId' });