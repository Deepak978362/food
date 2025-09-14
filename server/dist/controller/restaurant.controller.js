"use strict";
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
exports.getSingleRestaurant = exports.searchRestaurant = exports.updateOrderStatus = exports.getRestaurantOrder = exports.updateRestaurant = exports.getRestaurant = exports.createRestaurant = void 0;
const restaurant_model_1 = require("../models/restaurant.model");
const imageUpload_1 = __importDefault(require("../utils/imageUpload"));
const order_model_1 = require("../models/order.model");
const createRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;
        const restaurant = yield restaurant_model_1.Restaurant.findOne({ user: req.id });
        if (restaurant) {
            res.status(400).json({
                success: false,
                message: "Restaurant already exists for this user",
            });
            return;
        }
        if (!file) {
            res.status(400).json({
                success: false,
                message: "Image is required",
            });
            return;
        }
        const imageUrl = yield (0, imageUpload_1.default)(file);
        yield restaurant_model_1.Restaurant.create({
            user: req.id,
            restaurantName,
            city,
            country,
            deliveryTime,
            cuisines: JSON.parse(cuisines),
            imageUrl,
        });
        res.status(201).json({
            success: true,
            message: "Restaurant Added",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createRestaurant = createRestaurant;
const getRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurant_model_1.Restaurant.findOne({ user: req.id }).populate("menus");
        if (!restaurant) {
            res.status(404).json({
                success: false,
                restaurant: [],
                message: "Restaurant not found",
            });
            return;
        }
        res.status(200).json({ success: true, restaurant });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRestaurant = getRestaurant;
const updateRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;
        const restaurant = yield restaurant_model_1.Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
            return;
        }
        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        restaurant.cuisines = JSON.parse(cuisines);
        if (file) {
            const imageUrl = yield (0, imageUpload_1.default)(file);
            restaurant.imageUrl = imageUrl;
        }
        yield restaurant.save();
        res.status(200).json({
            success: true,
            message: "Restaurant updated",
            restaurant,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateRestaurant = updateRestaurant;
const getRestaurantOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurant_model_1.Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
            return;
        }
        const orders = yield order_model_1.Order.find({ restaurant: restaurant._id })
            .populate("restaurant")
            .populate("user");
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRestaurantOrder = getRestaurantOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = yield order_model_1.Order.findById(orderId);
        if (!order) {
            res.status(404).json({
                success: false,
                message: "Order not found",
            });
            return;
        }
        order.status = status;
        yield order.save();
        res.status(200).json({
            success: true,
            status: order.status,
            message: "Status updated",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateOrderStatus = updateOrderStatus;
const searchRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery || "";
        const selectedCuisines = (req.query.selectedCuisines || "").split(",").filter((cuisine) => cuisine);
        const query = {};
        // Basic search based on searchText (name, city, country)
        if (searchText) {
            query.$or = [
                { restaurantName: { $regex: searchText, $options: "i" } },
                { city: { $regex: searchText, $options: "i" } },
                { country: { $regex: searchText, $options: "i" } },
            ];
        }
        // Filter based on searchQuery
        if (searchQuery) {
            query.$or = [
                { restaurantName: { $regex: searchQuery, $options: "i" } },
                { cuisines: { $regex: searchQuery, $options: "i" } },
            ];
        }
        // Filter based on selected cuisines
        if (selectedCuisines.length > 0) {
            query.cuisines = { $in: selectedCuisines };
        }
        const restaurants = yield restaurant_model_1.Restaurant.find(query);
        res.status(200).json({
            success: true,
            data: restaurants,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.searchRestaurant = searchRestaurant;
const getSingleRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.id;
        const restaurant = yield restaurant_model_1.Restaurant.findById(restaurantId).populate({
            path: "menus",
            options: { createdAt: -1 },
        });
        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
            return;
        }
        res.status(200).json({ success: true, restaurant });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSingleRestaurant = getSingleRestaurant;
