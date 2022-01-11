module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "webS2Cards",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      card: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: false,
        field: "Card"
      },
      // قيادة
      lead: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Lead"
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Unit"
      },
      cardNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "CardNumber"
      },
      cardDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "CardDate"
      },
      conscripteType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ConscripteType"
      },
      /**
       * If the cards is no longer exists on the military web
       */
      isRejected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "IsRejected"
      },
      /**
       * Why It should be rejected
       * it will be serialized array
       * with all problems in the cards
       */
      problems: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "Problems"
      }
    },
    {
      tableName: "WebS2Cards",
      timestamps: false
    }
  );
};
