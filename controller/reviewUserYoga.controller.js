import mongoose from "mongoose";
import ReviewYoga from "../model/reviewUserYoga.model.js";
import Yoga from "../model/yoga.model.js";

export const addRatingAndReviewYoga = async (req, res) => {
    const { userId, yogaId, rating, review } = req.body;
    try {
        if (!userId || !yogaId || !rating) {
            return res.status(400).send({ message: 'User ID, Yoga ID, and rating are required.' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({ message: 'Rating must be between 1 and 5.' });
        }
        const newReview = new ReviewYoga({
            user: new mongoose.Types.ObjectId(userId),
            product: new mongoose.Types.ObjectId(yogaId),
            rating,
            review
        });
        await newReview.save();
        const yoga = await Yoga.findById(yogaId);
        if (!yoga) {
            return res.status(404).send({ message: 'Yoga item not found.' });
        } 
        yoga.ratings.push(newReview._id);
        const reviews = await ReviewYoga.find({ product: yogaId });
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

        yoga.averageRating = averageRating;
        await yoga.save();

        res.status(201).send({ message: 'Review added successfully.', yoga });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred.', error });
    }
}
export const getReviewsForYoga = async (req, res) => {
    const { yogaId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(yogaId)) {
            return res.status(400).send({ message: 'Invalid Yoga ID.' });
        }
        const reviews = await ReviewYoga.find({ product: yogaId }).populate('user', 'username email');

        if (!reviews || reviews.length === 0) {
            return res.status(404).send({ message: 'No reviews found for this yoga item.' });
        }
        res.status(200).send(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while fetching reviews.', error });
    }
}
export const getReviewForYogaByUser = async (req, res) => {
    const { yogaId, userId } = req.params;
    console.log(yogaId +"   asas   :    "+userId );
    try {
            if (!mongoose.Types.ObjectId.isValid(yogaId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ message: 'Invalid Yoga ID or User ID.' });
        }
        const review = await ReviewYoga.findOne({ product: yogaId, user: userId }).populate('user', 'username email');
        if (!review) {
            return res.status(404).send({ message: 'No review found for this yoga item by the specified user.' });
        }
        res.status(200).send(review);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while fetching the review.', error });
    }
}
export const updateReviewForYogaByUser = async (req, res) => {
    const { rating, review,yogaId, userId } = req.body;
    try {
            if (!mongoose.Types.ObjectId.isValid(yogaId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ message: 'Invalid Yoga ID or User ID.' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({ message: 'Rating must be between 1 and 5.' });
        }
        const existingReview = await ReviewYoga.findOne({ product: yogaId, user: userId });
        if (!existingReview) {
            return res.status(404).send({ message: 'Review not found.' });
        }
        existingReview.rating = rating;
        existingReview.review = review;
        await existingReview.save();
        const reviews = await ReviewYoga.find({ product: yogaId });
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        const yoga = await Yoga.findById(yogaId);
        yoga.averageRating = averageRating;
        await yoga.save();
        res.status(200).send({ message: 'Review updated successfully.', review: existingReview });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while updating the review.', error });
    }
}