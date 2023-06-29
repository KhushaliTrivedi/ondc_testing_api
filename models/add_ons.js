'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class add_ons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.add_on_option, { foreignKey: 'add_ons_id' });
      // this.hasMany(models.coupon_addons, { foreignKey: 'add_ons_id' });
      this.hasOne(models.per_product_add_ons, { foreignKey: 'add_ons_id' });
    }
  }
  add_ons.init({
    add_ons_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    add_on_type: {
      type: DataTypes.STRING,
      defaultValue: "radio"
    },
    order:{
      type:DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'add_ons',
    modelName: 'add_ons',
  });
  return add_ons;
};