'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class per_product_add_ons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.add_ons, { foreignKey: 'add_ons_id' });
      this.belongsTo(models.product_list, { foreignKey: 'product_list_id' });
    }
  }
  per_product_add_ons.init({
    per_product_add_ons_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    product_list_id: {
      type: DataTypes.UUID
    },
    add_ons_id: {
      type: DataTypes.UUID
    },
    required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }

  }, {
    sequelize,
    tableName: 'per_product_add_ons',
    modelName: 'per_product_add_ons',
  });
  return per_product_add_ons;
};