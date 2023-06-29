'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('ondc_stores', {
      ondc_store_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      mystore_seller_id: {
        type: DataTypes.STRING
      },
      access_key: {
        type: DataTypes.STRING,
        allowNull: false
      },
      store_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      store_url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      menu_branch_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      branches: {
        type: DataTypes.ARRAY(DataTypes.UUID)
      },
      franchise_id: {
        type: DataTypes.ARRAY(DataTypes.UUID)
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      region: {
        type: DataTypes.STRING,
        allowNull: false
      },
      longitude: {
        type: DataTypes.STRING
      },
      latitude: {
        type: DataTypes.STRING
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      timing: {
        type: DataTypes.STRING,
        allowNull: false
      },
      location_availability_mode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      location_availability_array: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      sync: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
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
    await queryInterface.dropTable('ondc_stores');
  }
};