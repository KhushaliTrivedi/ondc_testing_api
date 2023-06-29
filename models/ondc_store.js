'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ondc_store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ondc_store.init({
    ondc_store_id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    mystore_seller_id: {
      type: DataTypes.STRING
    },
    access_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    store_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    store_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    menu_branch_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    branches: {
      type: DataTypes.ARRAY(DataTypes.UUID)
    },
    franchise_id: {
      type: DataTypes.ARRAY(DataTypes.UUID)
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false
    },
    longitude: {
      type: DataTypes.STRING
    },
    latitude: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timing: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location_availability_mode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location_availability_array: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    sync: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'ondc_store',
    tableName: 'ondc_stores',
  });
  return ondc_store;
};