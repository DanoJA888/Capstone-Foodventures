import { DataTypes } from 'sequelize';
import { User } from './user.js';
import { sequelize } from '../database.js';

export const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recipeName: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

User.hasMany(Favorite, {foreignKey: 'id'});
Favorite.belongsTo(User, {foreignKey: 'id'});