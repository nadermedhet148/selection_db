const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Password",
    {
      Password: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
      },
      loadedForm: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Password",
      schema: "dbo",
      timestamps: true
      // indexes: [
      //   {
      //     name: "PK_Password",
      //     unique: true,
      //     fields: [
      //       { name: "Password" },
      //     ]
      //   },
      // ]
    }
  );
};
