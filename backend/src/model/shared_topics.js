const { DataTypes } = require("sequelize");
const { sequelize } = require("../connection");

const SharedTopicsModel = sequelize.define("SharedTopics", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  userSharedId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Asegúrate de que este nombre coincida con el de tu modelo de usuarios
      key: 'id'
    }
  },
  topicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'topics', // Asegúrate de que este nombre coincida con el de tu modelo de tópicos
      key: 'id'
    }
  },
  userDestinationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Igual que arriba
      key: 'id'
    }
  }
}, {
  tableName: 'shared_topics',
  timestamps: false
});

module.exports = {
  SharedTopicsModel
};
