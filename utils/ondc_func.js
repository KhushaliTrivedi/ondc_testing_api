const { default: axios } = require("axios");
const { ondc_store, ondc_store_category, ondc_store_products, categories, product, product_list, category_list } = require("../models");
const sequelize = require("sequelize");
function generate_alias(string) {
    const lowercased = string.toLowerCase();
    const replaced = lowercased.replace(/\s+/g, '-').trim();

    return replaced;
}

function generate_sku(string) {
    const lowercased = string.toLowerCase();
    const replaced = lowercased.replace(/\s+/g, '_').trim();

    return replaced;
}

function removeDuplicates(arr1, arr2) {
    return arr1.filter(value => !arr2.includes(value));
}

// Add ONDC Store Products Function
const add_ondc_store_products = async (body, store_data) => {

    const { menu_branch_id } = body;
    const ondc_store_id = store_data.ondc_store_id
    var array_product = [];

    const categoryData = await categories.findAll({
        where: { branch_id: menu_branch_id },
        include: [{ model: category_list }, {
            model: product
        }],
        // raw:true
    });

    for (var i = 0; i < categoryData.length; i++) {

        var ondc_categories_list = await ondc_store_category.create({
            category_list_id: categoryData[i].category_list.dataValues.category_list_id,
            ondc_store_id: ondc_store_id,
        });
        console.log(categoryData[i].products.length)
        for (var j = 0; j < categoryData[i].products.length; j++) {
            array_product.push({
                ondc_store_id: ondc_store_id,
                ondc_store_category_id: ondc_categories_list.dataValues.ondc_store_category_id,
                product_list_id: categoryData[i].products[j].dataValues.product_list_id,
                items_available: categoryData[i].products[j].dataValues.items_available
            })

        }
    }
    await ondc_store_products.bulkCreate(array_product);
}


// Sync Products/Categories with Mystore
const sync_products = async (ondc_store_id) => {
    const storeData = await ondc_store.findOne({ where: { ondc_store_id } });
    const productListData = await product_list.findAll({});
    const ondc_categoriesData = await ondc_store_category.findAll({ where: { ondc_store_id }, include: category_list });
    const productData = await ondc_store_products.findAll({ where: { ondc_store_id } });
    const categoryListData = await category_list.findAll({});
    let product_structure = [];
    var new_category_list_id = [];

    // Verify if category exist on Mystore
    var msg = "";
    let mystore_categories = {};
    let is_exist = await axios
        .get(
            `${storeData.store_url}ms.categories`,
            {
                headers: {
                    "access-key": storeData.access_key,
                },
            }
        )
        .then((response) => {
            is_verified = 1;
            mystore_categories = response.data.data;
        })
        .catch((error) => {
            console.log(error);
            if (error.response.status == 401) {
                is_verified = 0;
                msg = "Not Authorised!";
            } else {
                is_verified = 0;
                msg = "ONDC Store is not Verified!";
            }
        });
    if (msg != "") {
        return res.json({
            status: "failure",
            msg,
        });
    }

    let filtered_alias = [];
    let alias_data = [];
    for (let k = 0; k < ondc_categoriesData.length; k++) {
        const alias = generate_alias(ondc_categoriesData[k].category_list.category_name);
        alias_data.push(alias);
    }
    if (mystore_categories.length !== 0 && mystore_categories !== null) {
        let mystore_alias_data = [];
        for (let i = 0; i < mystore_categories.length; i++) {
            mystore_alias_data.push(mystore_categories[i].alias);
        }
        filtered_alias = removeDuplicates(alias_data, mystore_alias_data);
        console.log(filtered_alias)
    } else {

        filtered_alias = alias_data;
    }

    for (let k = 0; k < ondc_categoriesData.length; k++) {
        const alias = generate_alias(ondc_categoriesData[k].category_list.category_name);

        if (filtered_alias.includes(alias)) {
            console.log('IF')
            const data = {
                name: ondc_categoriesData[k].category_list.category_name,
                alias: alias,
                description: ondc_categoriesData[k].category_list.description,
                images: [
                    {
                        "image": ondc_categoriesData[k].category_list.card_img
                    }
                ],
                publish: 1
            };
            // console.log(data);
            if (data.length !== 0 && data !== null) {

                const mystore_category = await axios.post(`${storeData.store_url}ms.categories`, data, {
                    headers: {
                        "access-key": storeData.access_key,
                    },
                })
                var ondc_categories_list = await ondc_store_category.update({
                    ondc_catg_id: mystore_category.data.data._id,
                }, { where: { ondc_store_category_id: ondc_categoriesData[k].ondc_store_category_id } });
                // console.log(mystore_category.data)
                new_category_list_id.push({
                    'cat_list_id': ondc_categoriesData[k].category_list.category_list_id,
                    'ondc_cat_id': ondc_categoriesData[k].ondc_store_category_id,
                    'mystore_cat_id': mystore_category.data.data._id,
                    "alias": alias
                })
            }

        } else {
            console.log('ELSE')
            const ondc_categories_list = await ondc_store_category.findOne({ where: { ondc_store_category_id: ondc_categoriesData[k].ondc_store_category_id } })
            new_category_list_id.push({
                'cat_list_id': ondc_categories_list.category_list_id,
                'ondc_cat_id': ondc_categories_list.ondc_store_category_id,
                'mystore_cat_id': ondc_categories_list.ondc_catg_id,
                "alias": alias
            })
        }

        // console.log(new_category_list_id);
    };


    for (let i = 0; i < productData.length; i++) {
        const product = productListData.filter(obj => obj.product_list_id === productData[i].product_list_id);
        const ondc_category = new_category_list_id.filter(obj => obj.ondc_cat_id === productData[i].ondc_store_category_id);

        // Store ONDC Category ID and Category List ID in separate variables for further reference
        let ondc_store_category_id = "";
        let ondc_category_list_id = "";
        let category_alias = "";
        ondc_category.forEach(element => {
            console.log(element);
            ondc_store_category_id = element.ondc_cat_id;
            ondc_category_list_id = element.cat_list_id;
            category_alias = element.alias;
        });

        product.forEach(element => {
            // product_structure.length = 0;
            let alias = generate_alias(element.dataValues.product_name);
            let sku = generate_sku(element.dataValues.product_name);
            struct = {
                "name": element.dataValues.product_name,
                "description": element.dataValues.description,
                "alias": alias,
                "sku": sku,
                "price": element.dataValues.price,
                "categories": [
                    category_alias
                ],
                "shipping_cost": 10,
                "publish": "1",
                "inventory_quantity": productData[i].items_available,
                "images": [
                    {
                        "image": {
                            "data": element.dataValues.card_img,
                            "uploadType": "url",
                        }
                    }
                ],
                "enable_ondc_sync": 1,
                "location_availability_mode": storeData.location_availability_mode,
                [storeData.location_availability_mode]: storeData.location_availability_array,
                "country_of_origin": "IN",
                "ondc": {
                    "cancellable": "yes",
                    "returnable": "no"
                },
                "approve": "approved",
                "seller": storeData.mystore_seller_id,
            }
            // product_structure.push(struct);
            console.log(struct)
        });
    }
    return 1;
}



module.exports = {
    add_ondc_store_products,
    sync_products
}