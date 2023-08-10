import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';
import { User } from './user.js';

export const Favorite = sequelize.define('Favorite', {
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
  recipeName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image : {
    type: DataTypes.JSONB,
    allowNull: true
  }
});

Favorite.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Favorite, { foreignKey: 'userId' });
