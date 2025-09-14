"use strict";
// import express from "express";
// import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from "../controller/user.controller";
// import { isAuthenticated } from "../middlewares/isAuthenticated";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// router.route("/check-auth").get(isAuthenticated, checkAuth);
// router.route("/signup").post(signup);
// router.route("/login").post(login);
// router.route("/logout").post(logout);
// router.route("/verify-email").post(verifyEmail);
// router.route("/forgot-password").post(forgotPassword);
// router.route("/resetpassword/:token").post(resetPassword);
// router.route("/profile/update").put(isAuthenticated,updateProfile);
// export default router;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const multer_1 = __importDefault(require("../middlewares/multer")); // 👈 Import multer middleware
const router = express_1.default.Router();
router.route("/check-auth").get(isAuthenticated_1.isAuthenticated, user_controller_1.checkAuth);
router.route("/signup").post(user_controller_1.signup);
router.route("/login").post(user_controller_1.login);
router.route("/logout").post(user_controller_1.logout);
router.route("/verify-email").post(user_controller_1.verifyEmail);
router.route("/forgot-password").post(user_controller_1.forgotPassword);
router.route("/resetpassword/:token").post(user_controller_1.resetPassword);
// 👇 Add `upload.single("profilePicture")` to the middleware chain
router.route("/profile/update").put(isAuthenticated_1.isAuthenticated, multer_1.default.single("profilePicture"), user_controller_1.updateProfile);
exports.default = router;
