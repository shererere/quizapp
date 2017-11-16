module.exports = function(sequelize, DataTypes) {
  const UsersQuizzes = sequelize.define('users_quizzes', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    }
  }, {
    underscored: true,
  });
  return UsersQuizzes;
};
