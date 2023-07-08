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
      this.belongsTo(models.product_list, { foreignKey: 'product_list_id' });
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
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    ondc_catg_names: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    ondc_product_id: {
      type: DataTypes.STRING,
    },
    ondc_store_id: {
      type: DataTypes.UUID,
    },
    ondc_store_category_id: {
      type: DataTypes.ARRAY(DataTypes.UUID)
    },
    product_list_id: {
      type: DataTypes.UUID,
    },
    product_name: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    inventory_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1000
    },
  }, {
    sequelize,
    modelName: 'ondc_store_products',
    tableName: 'ondc_store_products',
  });
  return ondc_store_products;
};