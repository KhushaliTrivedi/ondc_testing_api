const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
    ondc_store,
    ondc_store_sellers,
} = require("../models");

const axios = require("axios");
// const { add_ondc_branch, ondc_product_sync } = require("../utils/ondc_func");

class adminOndcController {
    //  add ONDC Store
    async add_ondc_store(req, res) {
        try {
            if (!req.body) {
                return res.send({ status: "failure", msg: "Invalid Data!" });
            }
            const { mystore_seller_id, access_key, store_url, menu_branch_id } = req.body;

            //  Find if this seller's store exist or not!
            const store = await ondc_store.findOne({
                where: { mystore_seller_id, access_key, store_url, menu_branch_id },
            });

            if (store) {
                return res.json({
                    status: "failure",
                    msg: "ONDC store Exist!",
                });
            } else {
                // Verify Seller_id and access_key
                let seller_data = {};
                let is_verified = "";
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
                        seller_data = response.data
                    })
                    .catch((error) => {
                        console.log(error);
                        if (error.response.status == 404) {
                            is_verified = 0;
                            return res.json({
                                status: "failure",
                                msg: `No ONDC Store is mapped with Seller Id: ${mystore_seller_id}`,
                            });
                        } else if (error.response.status == 401) {
                            is_verified = 0;
                            return res.json({ status: "failure", msg: "Not Authorised!" });
                        } else {
                            is_verified = 0;
                            return res.json({
                                status: "failure",
                                msg: "ONDC Store is not Verified!",
                            });
                        }
                    });

                if (is_verified == 1) {
                    const store_data = await ondc_store.create(req.body);
                    const seller = {
                        ondc_store_id: store_data.ondc_store_id,
                        ondc_sellers_id: seller_data.data.user._id,
                        role: seller_data.data.user.role
                    }
                    const ondc_seller_data = await ondc_store_sellers.create(seller);
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
                        return res.json({
                            status: "failure",
                            msg: `No ONDC Store is mapped with Seller Id: ${mystore_seller_id}`,
                        });
                    } else if (error.response.status == 401) {
                        is_verified = 0;
                        return res.json({ status: "failure", msg: "Not Authorised" });
                    } else {
                        is_verified = 0;
                        return res.json({
                            status: "failure",
                            msg: "ONDC Store is not Verified!",
                        });
                    }
                });

            if (is_verified == 1) {
                const seller = {
                    ondc_sellers_id: seller_data.data.user._id,
                    role: seller_data.data.user.role
                }
                const update_seller = await ondc_store_sellers.update(seller, {
                    where: { ondc_store_id: req.params.id },
                });
                const update_store = await ondc_store.update(req.body, {
                    where: { ondc_store_id: req.params.id, mystore_seller_id: mystore_seller_id },
                });

                if (update_store[0] && update_seller[0]) {
                    const store_data = await ondc_store.findOne({ where: { ondc_store_id: req.params.id, mystore_seller_id: mystore_seller_id } })
                    const seller_data = await ondc_store_sellers.findOne({ where: { ondc_store_id: req.params.id } })
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
        }
    }


    // Get All Registered ONDC Stores
    async get_all_ondc_stores(req, res) {
        try {
            const store_data = await ondc_store.findAll();
            if (store_data.length != 0) {
                return res.send({
                    status: "Success",
                    msg: "Successfully fetched!",
                    branches: store_data,
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
            if (!req.params.id) {
                return res.send({ status: "failure", msg: "Please provide Store ID!" });
            }
            const store_data = await ondc_store.findOne({ where: { ondc_store_id: req.params.id } });
            if (store_data.length != 0) {
                if (store_data.active == true) {
                    return res.send({
                        status: "Success",
                        msg: "Successfully fetched!",
                        branches: store_data,
                    });
                } else {
                    return res.send({ status: "failure", msg: "Your store is currently inactive, please get in touch with the owner!" });
                }
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


    // Delete ONDC Store
    async delete_ondc_store(req, res) {
        try {
            const store = await ondc_store.update({ active: false }, {
                where: { ondc_store_id: req.params.id },
            });
            if (store[0]) {
                return res.json({ status: "success", msg: "Store deleted successfully!" });
            } else {
                return res.json({ status: "failure", msg: "deletion failed!" });
            }
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
