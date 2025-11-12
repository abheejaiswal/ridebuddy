const express = require('express');
const router = express.Router();
const ApiController = require("../controllers/ApiController");
const AuthController = require("../controllers/AuthController");
const AviatorApiController = require("../controllers/AviatorApiController");

//auth

router.post("/user/register", AuthController.user_register);
router.post("/user/login", AuthController.user_login);
router.post("/user/profile", AuthController.getProfile);
router.post("/user/updateprofile", AuthController.updateProfile);
router.post("/user/add_bank_account", AuthController.addBankAccount);
router.post("/user/update_bank_account", AuthController.updateBankAccount);
router.post("/user/get_bank_account", AuthController.getBankAccountDetails);
router.get("/user/adminqr", AuthController.adminqr);


//h
router.post("/user/saveroute", ApiController.user_saveRoute);
router.get("/user/help_support", ApiController.getHelpSupport);
router.get('/user/get_routes/:user_id', ApiController.getSavedAddresses);
router.post('/user/createRide', ApiController.createRide);
router.post('/user/searchRides', ApiController.searchRides);
router.post("/user/add_vehicle", ApiController.addVehicle);
router.get("/user/vehicleslist/:user_id", ApiController.getVehicles);
router.get("/user/notifications/:user_id", ApiController.getUserNotifications);
router.post("/user/notifications/mark-read", ApiController.markNotificationRead);
router.post('/user/upload_documents', ApiController.uploadDocumentsBase64);
router.post('/user/bookRide', ApiController.bookRide);
router.post("/user/rateingadd", ApiController.addRating);
router.post("/user/get_ratings", ApiController.getUserRatings);
router.post('/user/report', ApiController.reportUser);
router.get("/user/documents/:user_id", ApiController.getUserDocuments);
router.post("/user/yourRides", ApiController.yourRides);
router.post("/user/deleteSavedRoute", ApiController.deleteSavedRoute);
router.post("/user/updateRide", ApiController.updateRide);
router.post("/user/cancelRideOrBooking", ApiController.cancelRideOrBooking);
router.get('/user/fareRules', ApiController.getFareRules);
router.post('/user/getReports', ApiController.getReports);
router.post('/user/booking_complete', ApiController.completeUserBooking);
router.post('/user/ride_complete', ApiController.completeRide);
router.post('/user/record_ride_payment', ApiController.recordRidePayment);
router.post('/user/withdraw_request', ApiController.requestWithdraw);
router.post('/user/pay_due', ApiController.payDue);
router.post('/user/due_payment_history', ApiController.getDuePaymentHistory);
router.post('/user/withdraw_history', ApiController.getWithdrawRequestHistory);
router.post('/user/searchRidessss', ApiController.searchRidesss);
router.get('/user/vehicle_colors', ApiController.getVehicleColors);


module.exports = router;