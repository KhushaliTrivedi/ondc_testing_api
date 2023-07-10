'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('ondc_products_options', {
      ondc_products_options_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      options: DataTypes.ARRAY(DataTypes.JSONB),
      product_list_id: {
        type: DataTypes.UUID,
      },
      ondc_store_id: {
        type: DataTypes.UUID,
      },
      // ondc_store_products_id: {
      //   type: DataTypes.UUID,
      // },
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
    await queryInterface.dropTable('ondc_products_options');
  }
};