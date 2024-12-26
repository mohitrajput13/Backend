import express from "express"
import bodyParser from "body-parser"
import DoctorRouter from "./routers/doctor.router.js";
import mongoose from "mongoose";
import path from "path";
import dotenv from 'dotenv';
import password from "password";
import cookieSession from "cookie-session";
import { fileURLToPath } from "url";
import cors from 'cors';
import adminRouter from "./routers/admin.router.js";
import userRouter from "./routers/user.router.js"
import productRouter from "./routers/product.router.js";
import Categoryrouter from "./routers/AyurvedaCategory.route.js";
import CartRouter from "./routers/cart.router.js";
import OrderRouter from "./routers/order.router.js";
import yogaRouter from "./routers/yoga.router.js";
import Reviewrouter from "./routers/reviewUserProduct.route.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.static(path.join(__dirname,"public")));

mongoose.connect("mongodb://0.0.0.0:27017/ayurveda")
    .then(result => {
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use("/doctor", DoctorRouter);
        app.use('/admin',adminRouter);
        app.use('/user',userRouter);
        app.use('/product',productRouter);
        app.use('/category',Categoryrouter);
        app.use('/cart',CartRouter);
        app.use('/order',OrderRouter);
        app.use('/yoga',yogaRouter);
        app.use('/rate-review',Reviewrouter)
        app.listen(3000, () => {
            console.log("Server started....");
        });
    }).catch(err => {
        console.log(err);
    })