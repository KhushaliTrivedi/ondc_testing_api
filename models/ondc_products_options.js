'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ondc_products_options extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ondc_products_options.init({
    ondc_products_options_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    options: DataTypes.ARRAY(DataTypes.JSONB),
    product_list_id: {
      type: DataTypes.UUID,
    },
    ondc_store_id: {
      type: DataTypes.UUID,
    },
    // ondc_store_products_id: {
    //   type: DataTypes.UUID,
    // },
  }, {
    sequelize,
    modelName: 'ondc_products_options',
    tableName: 'ondc_products_options'
  });
  return ondc_products_options;
};