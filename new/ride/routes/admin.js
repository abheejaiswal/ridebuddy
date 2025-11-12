const express = require('express');

const router = express.Router();
const AdminController = require("../controllers/AdminController");
const LoginController = require("../controllers/LoginController");

router.get("/", LoginController.login);
router.post("/login_prosess", LoginController.login_process);

router.get("/dashboard", AdminController.dashboard);
router.get("/users", AdminController.users);
router.get("/users/block/:id", AdminController.blockUser);
router.get("/users/unblock/:id", AdminController.unblockUser);
router.get("/users", AdminController.users);
router.get("/document_detail/:id", AdminController.userDetail);








module.exports = router;