module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    // مدة سابقة حسنة
    /**
      مثلاً شخص كان في الجيش وخد اعفاء مؤقت 
      والمدة الي قعدها محسوبة
     */
    "prevPeriod",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      years: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Years"
      },
      months: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Months"
      },
      days: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Days"
      },
      militaryId: {
        type: DataTypes.STRING(128),
        allowNull: false,
        references: {
          model: "Conscriptes",
          key: "MilitaryId"
        },
        field: "ConsMilitaryId"
      }
    },
    {
      tableName: "PrevPeriod",
      timestamps: false
    }
  );
};
