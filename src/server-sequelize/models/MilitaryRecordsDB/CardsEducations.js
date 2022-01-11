module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "cardsEducations",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      memberId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "CardsFamilyMembers",
          key: "Id"
        },
        field: "MemberId"
      },
      level: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Level"
      },
      schoolName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "SchoolName"
      },
      applyDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "ApplyDate"
      }
    },
    {
      tableName: "CardsEducations",
      timestamps: false
    }
  );
};
