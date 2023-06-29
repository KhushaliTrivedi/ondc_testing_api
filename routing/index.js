const express = require("express");
const router = express.Router();

const adminOndcController = require("../controllers/ondc.controller");

router.route('/add_ondc_store').post(adminOndcController.add_ondc_store);
router.route('/edit_ondc_store/:id').post(adminOndcController.edit_ondc_store);
router.route('/delete_ondc_store/:id').post(adminOndcController.delete_ondc_store);
router.route('/get_all_ondc_stores').get(adminOndcController.get_all_ondc_stores);
router.route('/get_single_ondc_stores/:id').get(adminOndcController.get_single_ondc_stores);


module.exports = router;