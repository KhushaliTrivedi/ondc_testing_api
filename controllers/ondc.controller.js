const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
    ondc_store,
    ondc_store_sellers,
    ondc_store_category,
    ondc_store_products,
    category_list,
    branch,
    franchise
} = require("../models");

const axios = require("axios");
// const { add_ondc_store_products, sync_products } = require("../utils/ondc_func");
const ondcfn = require("../utils/ondc_func");

class adminOndcController {
    //  add ONDC Store
    async add_ondc_store(req, res) {
        try {
            if (!req.body) {
                return res.send({ status: "failure", msg: "Invalid Data!" });
            }
            const { access_key, store_name } = req.body;
            const store_url = req.body.store_url = `https://${store_name}.storehippo.com/api/1.1/entity/`;

            //  Find if this seller's store exist or not!
            const store = await ondc_store.findOne({
                where: {
                    [Op.or]: { access_key, store_url, store_name }
                },
            });

            if (store) {
                return res.json({
                    status: "failure",
                    msg: "ONDC store Exist!",
                });
            } else {
                // Fetch Seller's Data 
                let seller_data = {};
                let is_verified = "";
                var msg = "";
                let sellers = await axios
                    .get(
                        `${store_url}ms.sellers`,
                        {
                            headers: {
                                "access-key": access_key,
                            },
                        }
                    )
                    .then((response) => {
                        is_verified = 1;
                        seller_data = response.data.data;
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
                if (is_verified == 0) {
                    return res.json({
                        status: "failure",
                        msg,
                    });
                }
                if (is_verified == 1) {
                    const s_data = await ondc_store.create(req.body);
                    for (let i = 0; i < seller_data.length; i++) {
                        const seller = {
                            ondc_store_id: s_data.ondc_store_id,
                            ondc_sellers_id: seller_data[i].user._id,
                            role: seller_data[i].user.role
                        }
                        const ondc_seller_data = await ondc_store_sellers.create(seller);
                        if (seller_data[i].user.role == "superadmin") {
                            await ondc_store.update({ mystore_seller_id: seller_data[i].user._id }, { where: { ondc_store_id: s_data.ondc_store_id } })
                        }
                    }
                    ondcfn.add_ondc_store_products({
                        menu_branch_id: req.body.menu_branch_id,
                        ondc_store_id: s_data.ondc_store_id,
                    });
                    const store_data = await ondc_store.findOne({ where: { ondc_store_id: s_data.ondc_store_id } })
                    const ondc_seller_data = await ondc_store_sellers.findAll({ where: { ondc_store_id: s_data.ondc_store_id } })
                    return res.send({
                        status: "Success",
                        msg: "Successfully added, All products will be synced in 5 minutes!",
                        data: store_data,
                        seller: ondc_seller_data
                    });
                } else {
                    return res.send({
                        status: "failure",
                        msg: "ONDC Store is not Verified!",
                    });
                }
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                status: "failure",
                msg: err,
            });
        }
    }


    // Edit Single ONDC Store
    async edit_ondc_store(req, res) {
        if (!req.params.id) {
            return res.send({ status: "failure", msg: "Please provide Store ID!" });
        }

        const find_store = await ondc_store.findOne({
            where: { ondc_store_id: req.params.id },
        });

        if (find_store) {
            let store_url = "";
            let access_key = "";
            let mystore_seller_id = "";
            let seller_data = {};
            if (!req.body.store_url || req.body.store_url == "") {
                store_url = find_store.store_url;
            } else {
                store_url = req.body.store_url;
            }
            if (!req.body.mystore_seller_id || req.body.mystore_seller_id == "") {
                mystore_seller_id = find_store.mystore_seller_id;
            } else {
                mystore_seller_id = req.body.mystore_seller_id;
            }
            if (!req.body.access_key || req.body.access_key == "") {
                access_key = find_store.access_key;
            } else {
                access_key = req.body.access_key;
            }
            // Verify Seller_id and access_key
            let is_verified = "";
            let msg = "";
            let sellers_data = await axios
                .get(
                    `${store_url}ms.sellers/${mystore_seller_id}`,
                    {
                        headers: {
                            "access-key": access_key,
                        },
                    }
                )
                .then((response) => {
                    is_verified = 1;
                    seller_data = response.data;
                })
                .catch((error) => {
                    console.log(error);
                    if (error.response.status == 404) {
                        is_verified = 0;
                        msg = `No ONDC Store is mapped with Seller Id: ${mystore_seller_id}`;
                    } else if (error.response.status == 401) {
                        is_verified = 0;
                        msg = "Not Authorised";
                    } else {
                        is_verified = 0;
                        msg = "ONDC Store is not Verified!";
                    }
                });
            if (is_verified == 0) {
                return res.json({
                    status: "failure",
                    msg,
                });
            }
            if (is_verified == 1) {
                const excludedColumns = ['store_url', 'access_key', 'menu_branch_id', 'mystore_seller_id', 'sync', 'store_name', 'active'];

                const updateData = { ...req.body };
                excludedColumns.forEach(column => delete updateData[column]);

                const update_store = await ondc_store.update(updateData, {
                    where: { ondc_store_id: req.params.id, mystore_seller_id: mystore_seller_id },
                });

                if (update_store[0]) {
                    const store_data = await ondc_store.findOne({ where: { ondc_store_id: req.params.id, mystore_seller_id: mystore_seller_id } })
                    const seller_data = await ondc_store_sellers.findAll({ where: { ondc_store_id: req.params.id } })
                    return res.json({
                        status: "success",
                        msg: "Store Details Updated Successfully!",
                        store_data,
                        seller_data
                    });
                } else {
                    return res.json({ status: "failure", msg: "Update Failed!" });
                }
            } else {
                return res.send({
                    status: "failure",
                    msg: "ONDC Store is not Verified!",
                });
            }
        } else {
            return res.send({
                status: "failure",
                msg: "Please provide correct Store ID!",
            });
        }
    }


    // Get All Registered ONDC Stores
    async get_all_ondc_stores(req, res) {
        try {
            let condition = {};
            let storeData = [];
            var total_items = 0;
            if (req.query) {
                if (
                    req.query.active &&
                    req.query.active != ""
                ) {
                    storeData.length = 0;
                    const active = req.query.active;
                    condition.active = active;
                }

                const data = await ondc_store.findAndCountAll({
                    where: condition,
                });
                total_items = data.count;
                storeData.push(data.rows);
            } else {
                storeData.length = 0;
                const data = await ondc_store.findAndCountAll({});
                total_items = data.count;
                storeData.push(data.rows);
            }
            if (storeData.length > 0 && storeData[0].length != 0) {
                return res.send({
                    status: "Success",
                    msg: "Successfully fetched!",
                    store_data: storeData,
                    total_items
                });
            } else {
                return res.send({ status: "failure", msg: "Store Count: 0" });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                status: "failure",
                msg: err,
            });
        }
    }

    // Get Single ONDC Store
    async get_single_ondc_stores(req, res) {
        try {
            var pageSize = 100;
            var total_items = 0;
            if (req.query.pagesize && req.query.pagesize < 100) {
                pageSize = req.query.pagesize;
            }
            const pageNumber = req.query.pageNumber || 1;
            let ondc_store_id = req.params.id;
            let condition = {};
            let productData = [];
            const store_data = await ondc_store.findOne({
                where: { ondc_store_id },
            });
            if (store_data.active == true) {

                const catglist = await ondc_store_category.findAll({
                    where: { ondc_store_id },
                    include: category_list,
                });

                if (req.query) {
                    condition.ondc_store_id = ondc_store_id;
                    if (
                        req.query.ondc_store_category_id &&
                        req.query.ondc_store_category_id != ""
                    ) {
                        productData.length = 0;
                        const ondc_store_category_id = req.query.ondc_store_category_id;
                        condition.ondc_store_category_id = ondc_store_category_id;
                    }

                    const pData = await ondc_store_products.findAndCountAll({
                        where: condition,
                        include: [
                            ondc_store_category,
                        ],
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        limit: pageSize,
                        offset: (pageNumber - 1) * pageSize,
                        raw: true,
                    });
                    total_items = pData.count;
                    productData.push(pData.rows);
                } else {
                    productData.length = 0;
                    const pData = await ondc_store_products.findAndCountAll({
                        where: { ondc_store_id },
                        include: ondc_store_category,
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        limit: pageSize,
                        offset: (pageNumber - 1) * pageSize,
                    });
                    total_items = pData.count;
                    productData.push(pData.rows);
                }

                if (productData) {
                    return res.send({
                        status: "Success",
                        msg: "Successfully fetched!",
                        store: store_data,
                        products: productData,
                        total_items,
                        page: pageNumber,
                        perpage: pageSize,
                        catglist,
                    });
                } else {
                    return res.send({
                        status: "failure",
                        msg: "Store Count: 0",
                    });
                }
            } else {
                return res.send({ status: "failure", msg: "Your store is currently inactive, please get in touch with the owner!" });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                status: "failure",
                msg: err,
            });
        }
    }


    // Active Status ONDC Store
    async active_status_ondc_store(req, res) {
        try {
            if (!req.params.id) {
                return res.send({ status: "failure", msg: "Please provide Store ID!" });
            }

            var active = false
            if (req.query.active) {
                active = req.query.active;
            }
            const store = await ondc_store.update(
                { active },
                {
                    where: { ondc_store_id: req.params.id },
                }
            );
            if (store[0]) {
                return res.json({
                    status: "success",
                    msg: "Store Status Updated Successfully!",
                });
            } else {
                return res.json({ status: "failure", msg: "No Store Found!" });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                status: "failure",
                msg: err,
            });
        }
    }


    // Get Franchise
    async get_franchise(req, res) {
        try {
            const franchise_data = await franchise.findAll({ include: branch });
            return res.send({
                status: "Success",
                msg: "Successfully fetched!",
                franchise: franchise_data
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                status: "failure",
                msg: err,
            });
        }
    }


    // Sync Products on Mystore
    async sync_store_products(req, res) {
        const data = await ondcfn.sync_products(req.params.id)
        return res.send({
            status: "Success",
            data
        });
    }

    // TEST DELETE
    async test_del(req, res) {
        try {
            await ondc_store.destroy({ where: {} });
            await ondc_store_category.destroy({ where: {} });
            await ondc_store_sellers.destroy({ where: {} });
            await ondc_store_products.destroy({ where: {} });
            return res.send({
                status: "Success",
                data: ondc_store,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                status: "failure",
                msg: err,
            });
        }
    }
}
module.exports = new adminOndcController();
