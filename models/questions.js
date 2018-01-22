'use strict';

module.exports = function(sequelize, DataTypes) {
  const Questions = sequelize.define('questions', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      required: true,
    },
    correct_answer: {
      type: DataTypes.STRING,
      required: true,
    },
    wrong_answer1: {
      type: DataTypes.STRING,
      required: true,
    },
    wrong_answer2: {
      type: DataTypes.STRING,
      required: true,
    },
    wrong_answer3: {
      type: DataTypes.STRING,
      required: true,
    },
    has_image: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    underscored: true,
  });
  return Questions;
};
