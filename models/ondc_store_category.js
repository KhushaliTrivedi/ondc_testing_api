'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ondc_store_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.ondc_store, { foreignKey: 'ondc_store_id' });
      this.belongsTo(models.category_list, { foreignKey: 'category_list_id' });
    }
  }
  ondc_store_category.init({
    ondc_store_category_id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    category_list_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    ondc_store_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    ondc_catg_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'ondc_store_category',
    tableName: 'ondc_store_categories',
  });
  return ondc_store_category;
};