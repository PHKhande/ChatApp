const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ChatGroup = sequelize.define( 'group', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    GroupName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    
    CreatedBy: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

module.exports = ChatGroup;