import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import path from "path";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// const DIRNAME = path.resolve();
const DIRNAME = path.resolve(__dirname, "../../");

// default middleware for any mern project
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: "http://localhost:8000",
    credentials: true
}
app.use(cors(corsOptions));

// api
app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);

// app.use(express.static(path.join(DIRNAME,"/client/dist")));

app.use(express.static(path.join(DIRNAME, "client/dist")));
// app.use("*",(_,res) => {
//     res.sendFile(path.resolve(DIRNAME, "client","dist","index.html"));
// });


app.get("*", (_, res) => {
  res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});


// // STEP 1: LOAD ENVIRONMENT VARIABLES FIRST
// import dotenv from "dotenv";
// dotenv.config();

// // STEP 2: NOW IMPORT EVERYTHING ELSE
// import express from "express";
// import connectDB from "./db/connectDB";
// import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import userRoute from "./routes/user.route";
// import restaurantRoute from "./routes/restaurant.route";
// import menuRoute from "./routes/menu.route";
// import orderRoute from "./routes/order.route";
// import path from "path";


// const app = express();

// const PORT = process.env.PORT || 3000;

// const DIRNAME = path.resolve();

// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(express.json());
// app.use(cookieParser());
// const corsOptions = {
//     origin: "http://localhost:8000",
//     credentials: true
// }
// app.use(cors(corsOptions));

// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/restaurant", restaurantRoute);
// app.use("/api/v1/menu", menuRoute);
// app.use("/api/v1/order", orderRoute);

// app.use(express.static(path.join(DIRNAME,"/client/dist")));
// app.use("*",(_,res) => {
//     res.sendFile(path.resolve(DIRNAME, "client","dist","index.html"));
// });

// app.listen(PORT, () => {
//     connectDB();
//     console.log(`Server listen at port ${PORT}`);
// });