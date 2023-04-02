const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ArchivedMessage = sequelize.define( 'archivedmessage', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    message: Sequelize.TEXT('long'),
    userId: Sequelize.INTEGER,
    groupId: Sequelize.INTEGER

});

module.exports = ArchivedMessage;