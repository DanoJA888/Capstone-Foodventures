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
    allowNull: true
  },
  recipeId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cuisine: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  recipe :{
    type: DataTypes.JSONB,
    allowNull: false
  },
  difficulty :{
    type: DataTypes.JSONB,
    allowNull: true
  }
});

Recipe.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Recipe, { foreignKey: 'userId' });