"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.createTable("CardTypes", {
        Id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          field: "Id"
        },
        typeName: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "typeName"
        },
        expirationDateInYears: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "expirationDateInYears"
        }
      }),

      queryInterface.addColumn("Cards", {
        typeId: {
          type: Sequelize.INTEGER,
          references: {
            model: "CardTypes",
            key: "Id"
          },
          onUpdate: "cascade",
          onDelete: "cascade"
        }
      })
    ]);
  },

  down: async (queryInterface, DataTypes) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([queryInterface.removeColumn("Cards", "CardType")]);
  }
};
