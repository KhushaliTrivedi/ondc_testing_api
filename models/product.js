'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.product_list, { foreignKey: 'product_list_id' });
      this.belongsTo(models.categories, { foreignKey: 'category_id' });
    }
  }
  product.init({
    product_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    product_list_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    branch_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    items_available: {
      type: DataTypes.INTEGER
    },
    no_of_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'products',
    modelName: 'product',
  });
  return product;
};