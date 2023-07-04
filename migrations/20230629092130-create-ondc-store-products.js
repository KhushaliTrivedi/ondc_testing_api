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
        type: DataTypes.STRING,
        allowNull: false
      },
      ondc_product_id: {
        type: DataTypes.STRING,
      },
      ondc_store_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      ondc_store_category_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      product_list_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      items_available: {
        type: DataTypes.INTEGER
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