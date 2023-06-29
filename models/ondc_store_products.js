'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ondc_store_products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.ondc_store, { foreignKey: 'ondc_store_id' });
      this.belongsTo(models.ondc_store_category, { foreignKey: 'ondc_store_category_id' });
    }
  }
  ondc_store_products.init({
    ondc_store_products_id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    ondc_catg_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ondc_product_id: {
      type: DataTypes.STRING,
    },
    ondc_store_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    ondc_store_category_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    product_list_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'ondc_store_products',
    tableName: 'ondc_store_products',
  });
  return ondc_store_products;
};