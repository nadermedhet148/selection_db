/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tasdekSgsg",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID"
      },
      dateEltmas: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Date_eltmas"
      },
      rotba: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "rotba"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "name"
      },
      wehda: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "wehda"
      },
      mostafeed: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "mostafeed"
      },
      tash5Es: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "tash5es"
      },
      nateget3Ard: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "nateget_3ard"
      },
      tasdekNum: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "tasdek_num"
      },
      dateTasdek: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Date_tasdek"
      },
      mest: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Mest"
      },
      taklefa: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "taklefa"
      },
      modetRe3Aya: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "modet_re3aya"
      },
      tasdekAmana: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Tasdek_amana"
      },
      phoneNum: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "phone_num"
      },
      tamTasdek: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "tam_tasdek"
      },
      haletKhedma: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "halet_khedma"
      },
      mostarad: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "mostarad"
      },
      tamBatt: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "tam_batt"
      },
      militaryId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "MilitaryID"
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Address"
      },
      relationship: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Relationship"
      },
      dateBatt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Date_batt"
      }
    },
    {
      tableName: "TasdekSGSG",
      timestamps: false
    }
  );
};
