import express from 'express';
import { addRatingAndReview, getProductReviewsAndUsers, removeRatingController, updateRatingAndReview } from '../controller/reviewUserProduct.controller.js';
const Reviewrouter=express.Router();
Reviewrouter.post('/add-user-review-and-rating',addRatingAndReview);
Reviewrouter.post('/get-product-review',getProductReviewsAndUsers);
Reviewrouter.put('/change-review',updateRatingAndReview);
Reviewrouter.delete('/remove-rating',removeRatingController);
export default Reviewrouter;