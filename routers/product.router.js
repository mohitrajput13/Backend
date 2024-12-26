import express from "express";
import { addOneProduct, deleteProduct, getById, getProductList, saveInBulk } from "../controller/product.controller.js";
import multer from "multer";

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
router.post("/save-in-bulk",saveInBulk);
router.post("/addone",upload.single("image"),addOneProduct);
router.get("/getall",getProductList);
router.get("/getbyid/:id",getById);
router.delete("/delete/:id",deleteProduct);


export default router;