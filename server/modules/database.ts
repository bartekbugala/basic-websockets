import { Sequelize, DataTypes } from 'sequelize';

export class DatabaseModule {
  static async init(setup: any) {
    const sequelize = new Sequelize(
      setup.name,
      setup.username,
      setup.password,
      {
        host: setup.remote_url,
        dialect: 'mariadb',
        dialectOptions: {
          // Your mariadb options here
          connectTimeout: 3000,
        },
      }
    );

    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }

    const User = sequelize.define(
      'User',
      {
        // Model attributes are defined here
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          // allowNull defaults to true
        },
      },
      {
        // Other model options go here
      }
    );
    User.sync();
  }
  // ...
}

export default DatabaseModule;
