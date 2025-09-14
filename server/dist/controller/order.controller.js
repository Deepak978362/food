"use strict";
// import { Request, Response } from "express";
// import { Restaurant } from "../models/restaurant.model";
// import { Order } from "../models/order.model";
// import Stripe from "stripe";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLineItems = exports.stripeWebhook = exports.createCheckoutSession = exports.getOrders = void 0;
const restaurant_model_1 = require("../models/restaurant.model");
const order_model_1 = require("../models/order.model");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.Order.find({ user: req.id }).populate("user").populate("restaurant");
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.getOrders = getOrders;
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 👇 THIS IS THE DEBUGGING LOG TO SEE WHAT THE FRONTEND SENDS
    // console.log("Received checkout request body:", JSON.stringify(req.body, null, 2));
    // console.log("hi1")
    try {
        const checkoutSessionRequest = req.body;
        // Validate input data
        if (!checkoutSessionRequest.cartItems ||
            !checkoutSessionRequest.deliveryDetails ||
            !checkoutSessionRequest.restaurantId) {
            res.status(400).json({
                success: false,
                message: "Invalid request data",
            });
            return;
        }
        //    console.log("hi2")
        const restaurant = yield restaurant_model_1.Restaurant.findById(checkoutSessionRequest.restaurantId).populate("menus");
        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found.",
            });
            return;
        }
        const order = new order_model_1.Order({
            restaurant: restaurant._id,
            user: req.id,
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            status: "pending",
        });
        // Create line items for Stripe
        const menuItems = restaurant.menus;
        const lineItems = (0, exports.createLineItems)(checkoutSessionRequest, menuItems);
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            shipping_address_collection: {
                allowed_countries: ["GB", "US", "CA"],
            },
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/order/status`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order._id.toString(),
                images: JSON.stringify(menuItems.map((item) => item.image)),
            },
        });
        if (!session.url) {
            res.status(400).json({ success: false, message: "Error while creating session" });
            return;
        }
        yield order.save();
        res.status(200).json({ session });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createCheckoutSession = createCheckoutSession;
const stripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let event;
    try {
        const signature = req.headers["stripe-signature"];
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
        // Verify the webhook signature
        event = stripe.webhooks.constructEvent(payloadString, signature, secret);
    }
    catch (error) {
        console.error("Webhook error:", error.message);
        res.status(400).send(`Webhook error: ${error.message}`);
        return;
    }
    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object;
            const order = yield order_model_1.Order.findById((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.orderId);
            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }
            // Update the order with the amount and status
            if (session.amount_total) {
                order.totalAmount = session.amount_total;
            }
            order.status = "confirmed";
            yield order.save();
        }
        catch (error) {
            console.error("Error handling event:", error);
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }
    }
    // Acknowledge receipt of the event
    res.status(200).send();
});
exports.stripeWebhook = stripeWebhook;
const createLineItems = (checkoutSessionRequest, menuItems) => {
    // Create line items for Stripe
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuId);
        if (!menuItem) {
            throw new Error(`Menu item id not found`);
        }
        return {
            price_data: {
                currency: "inr",
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image],
                },
                unit_amount: menuItem.price * 100, // Convert to cents
            },
            quantity: cartItem.quantity,
        };
    });
    return lineItems;
};
exports.createLineItems = createLineItems;
