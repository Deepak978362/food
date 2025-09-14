"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const order_controller_1 = require("../controller/order.controller");
const router = express_1.default.Router();
router.route("/").get(isAuthenticated_1.isAuthenticated, order_controller_1.getOrders);
router.route("/checkout/create-checkout-session").post(isAuthenticated_1.isAuthenticated, order_controller_1.createCheckoutSession);
router.route("/webhook").post(express_1.default.raw({ type: 'application/json' }), order_controller_1.stripeWebhook);
exports.default = router;
