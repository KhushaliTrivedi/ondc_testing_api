'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.product,{foreignKey:'category_id'});
      this.belongsTo(models.category_list,{foreignKey:'category_list_id'});
      // this.belongsTo(models.branch,{foreignKey:'branch_id'});
    }
  }
  categories.init({
    category_id:{
      type:DataTypes.UUID,
      primaryKey:true,
      allowNull:false,
      defaultValue:DataTypes.UUIDV4
    },
    category_list_id:{
      type:DataTypes.UUID,
      allowNull:false
    },
    branch_id:{
      type:DataTypes.UUID,
      allowNull:false
    }
  }, {
    sequelize,
    tableName:'categories',
    modelName: 'categories',
  });
  return categories;
};