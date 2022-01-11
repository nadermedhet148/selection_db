/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "recommendationSearchGridView",
    {
      م: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "م",
        primaryKey: true
      },
      الرقمالعسكرى: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "الرقم العسكرى"
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
      المستوىالثقافى: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "المستوى الثقافى"
      },
      المؤهلالعلمى: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "المؤهل العلمى"
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
      القياس: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "القياس"
      },
      عددالموصيين: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "عدد الموصيين"
      }
    },
    {
      tableName: "RecommendationSearchGridView",
      timestamps: false
    }
  );
};
