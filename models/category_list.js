'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category_list extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.categories,{foreignKey:'category_list_id'})
    }
  }
  category_list.init({
    category_list_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    description: {
      type: DataTypes.STRING,
      allowNull:false
    },
    card_img: {
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    tableName:'category_lists',
    modelName: 'category_list',
  });
  return category_list;
};