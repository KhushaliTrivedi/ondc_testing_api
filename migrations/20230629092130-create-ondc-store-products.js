'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('ondc_store_products', {
      ondc_store_products_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      ondc_catg_id: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      ondc_catg_names: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      ondc_product_id: {
        type: DataTypes.STRING,
      },
      ondc_store_id: {
        type: DataTypes.UUID,
      },
      ondc_store_category_id: {
        type: DataTypes.ARRAY(DataTypes.UUID)
      },
      product_list_id: {
        type: DataTypes.UUID,
      },
      product_name: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.FLOAT,
      },
      inventory_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1000
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('ondc_store_products');
  }
};