import express from "express";
import { addOrder, getUserOrders } from "../controller/order.controller.js";
const router = express.Router();
router.post('/add-order',addOrder);
router.post('/get-order-details',getUserOrders);
export default router;