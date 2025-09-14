// import express from "express";
// import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from "../controller/user.controller";
// import { isAuthenticated } from "../middlewares/isAuthenticated";

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

import express from "express";
import { 
    checkAuth, 
    forgotPassword, 
    login, 
    logout, 
    resetPassword, 
    signup, 
    updateProfile, 
    verifyEmail 
} from "../controller/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import upload from "../middlewares/multer"; // 👈 Import multer middleware

const router = express.Router();

router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/resetpassword/:token").post(resetPassword);

// 👇 Add `upload.single("profilePicture")` to the middleware chain
router.route("/profile/update").put(isAuthenticated, upload.single("profilePicture"), updateProfile);

export default router;