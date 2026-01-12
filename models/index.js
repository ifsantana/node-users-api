const sequelize = require('../config/sequelize');
const Sequelize = require('sequelize');
const UserModel = require('./User');

const User = UserModel(sequelize, Sequelize.DataTypes);

const db = {
    User,
    sequelize
}

module.exports = db