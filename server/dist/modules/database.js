"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const sequelize_1 = require("sequelize");
class DatabaseModule {
    static init(setup) {
        return __awaiter(this, void 0, void 0, function* () {
            const sequelize = new sequelize_1.Sequelize(setup.name, setup.username, setup.password, {
                host: setup.remote_url,
                dialect: 'mariadb',
                dialectOptions: {
                    // Your mariadb options here
                    connectTimeout: 3000,
                },
            });
            try {
                yield sequelize.authenticate();
                console.log('Connection has been established successfully.');
            }
            catch (error) {
                console.error('Unable to connect to the database:', error);
            }
            const User = sequelize.define('User', {
                // Model attributes are defined here
                firstName: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false,
                },
                lastName: {
                    type: sequelize_1.DataTypes.STRING,
                    // allowNull defaults to true
                },
            }, {
            // Other model options go here
            });
            User.sync();
        });
    }
}
exports.DatabaseModule = DatabaseModule;
exports.default = DatabaseModule;
