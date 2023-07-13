import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
  ,
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  height_ft: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  height_in: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
  
});