'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ondc_store_sellers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.ondc_store, { foreignKey: 'ondc_store_id' });
    }
  }
  ondc_store_sellers.init({
    ondc_store_sellers_id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    ondc_store_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    ondc_sellers_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'ondc_store_sellers',
    tableName: 'ondc_store_sellers',
  });
  return ondc_store_sellers;
};