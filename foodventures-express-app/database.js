import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('mydatabase', 'dano888', 'Daguil7146*', {
  host: 'localhost',
  dialect: 'postgres'
});