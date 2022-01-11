/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "recommendationsGridView",
    {
      الرقمالعسكرى: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "الرقم العسكرى",
        primaryKey: true
      },
      الاسم: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "الاسم"
      },
      الرقمالثلاثى: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "الرقم الثلاثى"
      },
      المحافظة: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "المحافظة"
      },
      منطقةالتجنيد: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "منطقة التجنيد"
      },
      إتجاهالفرد: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "إتجاه الفرد"
      },
      الوحدةالمطلوبة: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "الوحدة المطلوبة"
      },
      التوزيعة: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "التوزيعة"
      },
      المصدق: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "المصدق"
      },
      الموصى: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "الموصى"
      },
      ملاحظات: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ملاحظات"
      },
      إتجاهالتوصية: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "إتجاه التوصية"
      },
      عددالموصيين: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "عدد الموصيين"
      }
    },
    {
      tableName: "Recommendations_GridView",
      timestamps: false
    }
  );
};
