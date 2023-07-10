'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class add_on_option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.add_ons,{foreignKey:'add_ons_id'});
    }
  }
  add_on_option.init({
    add_on_option_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4
    },
    add_ons_id:{
      type:DataTypes.UUID,
      allowNull:false
    },
    title: {
      type: DataTypes.STRING,
      allowNull:false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull:false
    },
    zomato_additional_price: {
      type: DataTypes.FLOAT,
      defaultValue:0
    },
    sku: {
      type: DataTypes.STRING,
      allowNull:false
    },
    order:{
      type:DataTypes.INTEGER
    }
  }, {
    sequelize,
    tableName:'add_on_options',
    modelName: 'add_on_option',
  });
  return add_on_option;
};