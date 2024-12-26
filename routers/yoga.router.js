import express from "express";
import { addYoga,addInBulkYoga, getAll, updateYogaByName, removeYogaByName, updateYogaById, removeYogaById } from "../controller/yoga.controller.js";
import { addRatingAndReviewYoga, getReviewForYogaByUser, getReviewsForYoga, updateReviewForYogaByUser } from "../controller/reviewUserYoga.controller.js";


const router=express.Router();

router.post("/addYoga",addYoga);
router.post("/add-in-bulk-yoga",addInBulkYoga ) 
router.get("/getAll",getAll);

router.put("/updateYogaById",updateYogaById);
router.delete("/removeYogaById/:id",removeYogaById);

router.put("/updateYogaByName",updateYogaByName);
router.delete("/removeYogaByName",removeYogaByName);

router.post('/add-yoga-review',addRatingAndReviewYoga);
router.get('/get-review-for-yoga/:yogaId',getReviewsForYoga);
router.get('/getYogaReview/:yogaId/:userId', getReviewForYogaByUser);
router.put('/updateYogaReview', updateReviewForYogaByUser);
export default router;
