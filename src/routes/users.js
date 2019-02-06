const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const validation = require("./validation");

router.get("/users/signup", userController.signUp);
router.post("/users/signup", validation.validateNewUsers, userController.create);
router.get("/users/signin", userController.signInForm);
router.post("/users/signin", validation.validateSigninUsers, userController.signIn);
router.get("/users/signout", userController.signOut);
router.get("/users/:id/downgrade", userController.downgradePage);
router.post("/users/:id/downgrade", userController.downgrade);
router.get("/users/:id/upgrade", userController.upgradePage);
router.post("/users/:id/upgrade", userController.upgrade);
router.get("/users/:id/collaborations", userController.showCollaborations);


 module.exports = router; 