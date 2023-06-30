'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class franchise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.branch,{foreignKey:'franchise_id'})
    }
  }
  franchise.init({
    franchise_id:{
      primaryKey:true,
      allowNull:false,
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4
    },
    franchise_name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    location: {
      type:DataTypes.STRING,
      allowNull:false
    },
    no_branches:{
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    tableName:'franchises',
    modelName: 'franchise',
  });
  return franchise;
};