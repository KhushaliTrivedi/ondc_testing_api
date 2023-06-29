const { ondc_store, ondc_store_category, ondc_store_products, categories, product, product_list, category_list, per_product_add_ons, add_ons, add_on_option } = require("../models");
const axios = require("axios");
const sequelize = require("sequelize");
const uuid = require('uuid');

function generate_alias(string) {
    const lowercased = string.toLowerCase();
    const replaced = lowercased.replace(/\s+/g, '-').trim();

    return replaced;
}

// Add ONDC Store Products Function
const add_ondc_store_products = async (body, store_data) => {
    try {

        const { mystore_seller_id, access_key, store_url, menu_branch_id } = req.body;
        const ondc_store_id = branch_data.ondc_store_id

        //  Find branch data based on passed branch_id
        // const branchData = await branch.findOne({
        //   where: { branch_id }
        // });

        //  Find categories data based on branch_id
        const categoryData = await categories.findAll({
            where: { menu_branch_id },
            include: category_list
        });

        const headers = {
            'access-key': access_key,
        };

        var new_category_list_id = [];
        for (let i = 0; i < categoryData.length; i++) {
            const alias = generate_alias(categoryData[i].category_list.category_name);
            const data = {
                name: categoryData[i].category_list.category_name,
                alias: alias,
                description: categoryData[i].category_list.description,
                images: [
                    {
                        "image": categoryData[i].category_list.card_img
                    }
                ],
                publish: 1
            };
            const mystore_category = await axios.post(`${store_url}ms.categories`, data, { headers })
            var ondc_categories_list = await ondc_store_category.create({
                mystore_category_id: mystore_category.data.data._id,
                category_list_id: categoryData[i].category_list_id,
                ondc_store_id: ondc_store_id
            });
            new_category_list_id.push({
                'cat_list_id': ondc_categories_list.dataValues.category_list_id,
                'ondc_cat_id': ondc_categories_list.dataValues.ondc_category_id,
                'mystore_cat_id': ondc_categories_list.dataValues.mystore_category_id
            })
        }

        // //  Find products data based on branch_id
        // const productData = await product.findAll({
        //     where: { menu_branch_id },
        //     include: product_list,
        // });


        // const productNamesMap = new Map();
        // productData.forEach((product) => {
        //     const productName = product.product_list.product_name;
        //     const count = productNamesMap.get(productName) || 0;
        //     productNamesMap.set(productName, count + 1);
        // });

        // const filteredProducts = productData.filter((product) => {
        //     const productName = product.product_list.product_name;
        //     const count = productNamesMap.get(productName);
        //     // Keep the product if the count is 1 (no duplicates) or if it's the first occurrence
        //     return count === 1 || count === 0;
        // });
        // // console.log(filteredProducts)

        // const ondc_cat = await ondc_categories.findAll({
        //     where: { ondc_store_id }
        // });

        // const zip_codes_arr = ["133301", "110085", "363642"];
        // const zip_codes = zip_codes_arr.join(',');

        // var all_product = [];
        // for (let i = 0; i < filteredProducts.length; i++) {
        //     for (let j = 0; j < categoryData.length; j++) {
        //         for (let k = 0; k < new_category_list_id.length; k++) {
        //             if (filteredProducts[i].category_id == categoryData[j].category_id) {
        //                 if (new_category_list_id[k].cat_list_id == categoryData[j].category_list_id) {
        //                     if (filteredProducts[i].product_list.price != 0) {
        //                         all_product.push({
        //                             product_list_id: filteredProducts[i].product_list_id,
        //                             ondc_store_id: ondc_store_id,
        //                             ondc_category_id: new_category_list_id[k].ondc_cat_id,
        //                             additional_price: 0,
        //                             no_of_order: i,
        //                             cancellable: false,
        //                             returnable: false,
        //                             shipping_cost: 40,
        //                             zip_codes: zip_codes,
        //                             sync: false,
        //                         })
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        // const result = await ondc_products.bulkCreate(all_product);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "failure",
            msg: err,
        });
    }
}



module.exports = {
    add_ondc_store_products
}