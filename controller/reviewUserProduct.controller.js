import { Order } from "../model/order.model.js";
import { Product } from "../model/product.model.js";
import Review from "../model/reviewUserProduct.model.js";

export const addRatingAndReview = async (req, res) => {
  try {
    const { userId, productId, rating, review } = req.body;
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }
    const newReview = new Review({
      user: userId,
      product: productId,
      rating,
      review,
    });
    await newReview.save();
    await Product.findByIdAndUpdate(productId, {
      $push: { ratings: newReview },
    });
    const existingReviews = await Review.find({ product: productId });
    let totalRating = 0;
    existingReviews.forEach((review) => {
      totalRating += review.rating;
    });
    const averageRating = totalRating / existingReviews.length;
    await Product.findByIdAndUpdate(productId, { averageRating });
    const order = await Order.findOne({
      user: userId,
      "products.product": productId,
    });
    if (order) {
      const productIndex = order.products.findIndex(
        (product) => product.product.toString() === productId
      );
      if (productIndex !== -1) {
        order.products[productIndex].review = 1;
        await order.save();
      }
    }
    return res
      .status(201)
      .json({ message: "Rating and review added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductReviewsAndUsers = async (req, res) => {
  const productId = req.body.productId;
  try {
    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "username email"
    );
    const users = reviews.map((review) => ({
      user: review.user,
      review: review.review,
      rating: review.rating,
    }));

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRatingAndReview = async (req, res) => {
  try {
    const { userId, productId, rating, review } = req.body;
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    existingReview.rating = rating;
    existingReview.review = review;
    await existingReview.save();
    const existingReviews = await Review.find({ product: productId });
    let totalRating = 0;
    existingReviews.forEach((review) => {
      totalRating += review.rating;
    });
    const averageRating = totalRating / existingReviews.length;
    await Product.findByIdAndUpdate(productId, { averageRating });
    return res
      .status(200)
      .json({ message: "Rating and review updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeRatingController = async (req, res) => {
  const ratingId = req.params.ratingId;
  try {
    const rating = await Review.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }
    await rating.remove();
    const productId = rating.product;
    const existingReviews = await Review.find({ product: productId });
    let totalRating = 0;
    existingReviews.forEach((review) => {
      totalRating += review.rating;
    });
    const averageRating =
      existingReviews.length > 0 ? totalRating / existingReviews.length : 0;
    await Product.findByIdAndUpdate(productId, { averageRating });
    const order = await Order.findOne({ "products.product": productId });
    if (order) {
      const productIndex = order.products.findIndex(
        (product) => product.product.toString() === productId
      );
      if (productIndex !== -1) {
        order.products[productIndex].review = 0;
        await order.save();
      }
    }
    return res.status(200).json({ message: "Rating removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
