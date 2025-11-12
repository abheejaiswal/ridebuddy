const express = require('express');

const router = express.Router();
const AdminController = require("../controllers/AdminController");
const LoginController = require("../controllers/LoginController");

router.get("/", LoginController.login);
router.post("/login_prosess", LoginController.login_process);

router.get("/dashboard", AdminController.dashboard);
router.get("/users", AdminController.users);
router.get("/setting", AdminController.setting);
router.post("/update", AdminController.updateSetting);
router.get("/users/block/:id", AdminController.blockUser);
router.get("/users/unblock/:id", AdminController.unblockUser);
router.get("/user_view_more/:id", AdminController.user_view_more); 
router.get("/document_detail/:id", AdminController.userDetail); 

router.get("/ride-details", AdminController.ride_list);
router.post("/ride-details/delete/:id", AdminController.ride_delete);
router.get("/vehicle", AdminController.vehicle_list);
//brand
router.get("/brand_list", AdminController.brand_list);
router.get("/get_brands", AdminController.get_brands);
router.post('/add_brand', AdminController.add_brand);        // Add new brand
router.post('/edit_brand', AdminController.edit_brand);      // Edit existing brand
router.post('/delete_brand', AdminController.delete_brand);
 //modal
 router.get("/modal_list", AdminController.modal_list);
router.get("/get_modals", AdminController.get_modal);
router.post('/add_modal', AdminController.add_modal);        
router.post('/edit_modal', AdminController.edit_modal);      
router.post('/delete_modal', AdminController.delete_modal);  
//
router.get("/vehicle_color", AdminController.vehicle_color); 
router.post("/vehicle_color/delete/:id", AdminController.vehicleColor_delete);
router.post('/vehicle_color/update/:id', AdminController.update_vehiclecolor); 
router.post('/vehicle_color/add', AdminController.addVehicle); 

router.get("/Payment", AdminController.payment);
router.post("/Payment/delete/:id",AdminController.Payment_delete)

router.get("/feedback", AdminController.feedback);
router.get("/ridebooking_details", AdminController.ride_booking); 
router.get('/update-document-status/:id/:status', AdminController.updateDocumentStatus);


router.get('/notification', AdminController.user_notification);
router.post('/notification/send', AdminController.send_notification);
router.post('/notification/delete/:id', AdminController.notification_delete);
router.post('/notification/delete-multiple', AdminController.notification_delete_multiple);

router.get("/duepayment", AdminController.due_payment);


router.get("/bank_details", AdminController.bank_details); 
router.post("/bank_details/delete/:id",AdminController.bankdetails_delete)

router.get("/fare-rules", AdminController.fare_rules);
router.post('/fare-rules/delete/:id', AdminController.deletefare_rules); 
router.post('/fare-rules/update/:id', AdminController.updateFareRule); 
router.post('/fare-rules/add', AdminController.addPayment);  
router.get("/ride_stop/:id", AdminController.ride_stop);

router.get("/commission", AdminController.commission); 
router.post('/commission/add', AdminController.add_commission);  
router.post("/commission/delete/:id", AdminController.commission_delete); 
router.post('/commission/update/:id',AdminController.update_commission);

router.get('/report',AdminController.report); 
router.get('/withdrwal',AdminController.withdrwal_history); 
router.post('/withdrawal_update', AdminController.update_withdraw_status);
router.post("/update-password", AdminController.updatePassword);
module.exports = router;