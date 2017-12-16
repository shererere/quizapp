'use strict';

module.exports = function(sequelize, DataTypes) {
  const Quizzes = sequelize.define('quizzes', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      required: true,
    },
    size: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    underscored: true,
  });
  return Quizzes;
};
