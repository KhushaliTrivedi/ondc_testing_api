'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_list extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.product, { foreignKey: 'product_list_id' });
      // this.hasMany(models.add_ons, { foreignKey: 'product_list_id' });
      this.hasMany(models.per_product_add_ons, { foreignKey: 'product_list_id' });
    }
  }
  product_list.init({
    product_list_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
    },
    card_img: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_customer: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    prepare_time: {
      type: DataTypes.STRING
    },
    product_type: {
      type: DataTypes.STRING
    },
    food_type: {
      type: DataTypes.STRING
    },
    ID: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    no_of_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'product_lists',
    modelName: 'product_list',
  });
  return product_list;
};