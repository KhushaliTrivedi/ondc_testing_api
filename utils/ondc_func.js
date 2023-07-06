const { default: axios } = require("axios");
const { ondc_store, ondc_store_category, ondc_store_products, categories, product, product_list, category_list, add_ons, add_on_option, per_product_add_ons } = require("../models");
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
    const ondc_store_id = store_data.ondc_store_id;
    var array_product = [];

    //  Find categories data based on branch_id
    const categoryData = await categories.findAll({
        where: { branch_id: menu_branch_id },
        include: [
            { model: category_list },
            {
                model: product,
            },
        ],
        // raw:true
    });
    // console.log("categoryData",categoryData);
    for (var i = 0; i < categoryData.length; i++) {
        //
        var ondc_categories_list = await ondc_store_category.create({
            category_list_id: categoryData[i].category_list.category_list_id,
            // ondc_store_id: "64f36436-692d-465a-964a-164bd67b18c0",
            ondc_store_id,
            ondc_catg_name: categoryData[i].category_list.category_name,

            // ondc_catg_id: mystore_category.data.data._id,
        });
        //   console.log(categoryData[i].products.length);
        for (var j = 0; j < categoryData[i].products.length; j++) {
            // console.log("j", j);
            array_product.find(async (item) => {
                if (
                    item.product_list_id == categoryData[i].products[j].product_list_id
                ) {
                    return item;
                }
            });
            const index = array_product.findIndex(
                (obj) =>
                    obj.product_list_id == categoryData[i].products[j].product_list_id
            );

            // If the object is found, update it with the provided data
            if (index !== -1) {
                // array_product[index] = { ...arr[index], ...updatedData };
                const tjh = {
                    ondc_store_id,
                    ondc_catg_id: [],
                    ondc_catg_names: [
                        ondc_categories_list.ondc_catg_name,
                        ...array_product[index].ondc_catg_names,
                    ],
                    ondc_store_category_id: [
                        ondc_categories_list.ondc_store_category_id,
                        ...array_product[index].ondc_store_category_id,
                    ],
                    product_list_id: categoryData[i].products[j].product_list_id,
                };
                array_product[index] = tjh;
            } else {
                array_product.push({
                    ondc_store_id,
                    ondc_catg_id: [],
                    ondc_catg_names: [ondc_categories_list.ondc_catg_name],
                    ondc_store_category_id: [ondc_categories_list.ondc_store_category_id],
                    product_list_id: categoryData[i].products[j].product_list_id,
                    product_list_id: categoryData[i].products[j].product_list_id,
                    items_available: categoryData[i].products[j].items_available,
                });
            }
        }
    }

    // console.log("1", 34, array_product);
    await ondc_store_products.bulkCreate(array_product);
    // console.log("1", 34, array_product.length);
}


// Sync Products/Categories with Mystore
const sync_products = async (ondc_store_id) => {
    const storeData = await ondc_store.findOne({ where: { ondc_store_id } });
    const productListData = await product_list.findAll({});
    const ondc_categoriesData = await ondc_store_category.findAll({ where: { ondc_store_id }, include: category_list });
    const productData = await ondc_store_products.findAll({ where: { ondc_store_id } });
    const categoryListData = await category_list.findAll({});
    const per_product_addOns = await per_product_add_ons.findAll({ where: { required: true } });
    const addOns = await add_ons.findAll({ include: add_on_option });
    const addOnsOptions = await add_on_option.findAll({});
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
                    'ondc_store_category_id': ondc_categoriesData[k].ondc_store_category_id,
                    'mystore_cat_id': mystore_category.data.data._id,
                    "alias": alias
                })
            }

        } else {
            console.log('ELSE')
            const ondc_categories_list = await ondc_store_category.findOne({ where: { ondc_store_category_id: ondc_categoriesData[k].ondc_store_category_id } })
            new_category_list_id.push({
                'cat_list_id': ondc_categories_list.category_list_id,
                'ondc_store_category_id': ondc_categories_list.ondc_store_category_id,
                'mystore_cat_id': ondc_categories_list.ondc_catg_id,
                "alias": alias
            })
        }

        // console.log(new_category_list_id);
    };


    let variants = [];
    function get_add_ons_options(product_list_id, productPrice, quantity) {
        let options = [];
        const addOns_per_prod = per_product_addOns.filter(obj => obj.product_list_id === product_list_id);

        // console.log(addOns_per_prod)
        let options_data = [];
        let options_data_var = [];
        let data = {};
        addOns_per_prod.forEach(element => {
            data.length = 0;
            const add_Ons = addOns.filter(obj => obj.add_ons_id === element.add_ons_id);
            options.push(add_Ons);
        });
        let options_d = [];
        for (let i = 0; i < options.length; i++) {
            let add_on_title = "";
            let values = [];
            let add_on_option_id = [];
            options[i].forEach(element => {
                add_on_title = element.title;
                values.length = 0;
                for (let j = 0; j < element.add_on_options.length; j++) {
                    values.push(element.add_on_options[j].title);
                    add_on_option_id.push(element.add_on_options[j].add_on_option_id);
                }
                options_d.push({
                    "name": add_on_title,
                    "options": values
                });
                options_data_var.push({
                    "name": add_on_title,
                    "values": values,
                    "add_on_option_id": add_on_option_id
                })
            })
        }
        options_data.push({
            "options": options_d,
        });
        options_data.push({
            "variants": generateVariations(options_d)
        });
        // console.dir(options_data, { depth: null })

        const variations = generateVariations(options_d);
        console.log(variations);

        // Variations
        function generateVariations(variants, currentVariation = {}, index = 0, variations = []) {
            if (index === variants.length) {
                variations.push(currentVariation);
                return;
            }

            const currentVariant = variants[index];
            const variantOptions = currentVariant.options;

            for (let i = 0; i < variantOptions.length; i++) {
                const option = variantOptions[i];
                const newVariation = { ...currentVariation, [currentVariant.name]: option };
                generateVariations(variants, newVariation, index + 1, variations);
            }
            return variations;
        }
        return options_data;
    }

    for (let i = 0; i < productData.length; i++) {
        const product = productListData.filter(obj => obj.product_list_id === productData[i].product_list_id);
        const ondc_category = new_category_list_id.filter(obj => obj.ondc_store_category_id === productData[i].ondc_store_category_id);

        // Store ONDC Category ID and Category List ID in separate variables for further reference
        let category_alias = "";
        ondc_category.forEach(element => {
            // console.log(element);
            category_alias = element.alias;
        });

        product.forEach(element => {
            const options = get_add_ons_options(element.dataValues.product_list_id, element.dataValues.price, productData[i].items_available)
            let options_data = [];
            let variants_data = [];
            options.forEach(element => {
                if (element.options && element.options.length > 0) {
                    options_data.push(element.options);
                }
                if (element.variants && element.variants.length > 0) {
                    variants_data.push(element.variants);
                }
            });
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
                "options": options_data,
                "variants": variants_data,
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
            // console.log(struct)
        });
    }
    return 1;
}



module.exports = {
    add_ondc_store_products,
    sync_products
}