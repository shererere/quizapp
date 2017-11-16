module.exports = function(sequelize, DataTypes) {
  const UsersAnswers = sequelize.define('users_answers', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      required: true,
    },
  }, {
    underscored: true,
  });
  return UsersAnswers;
};
