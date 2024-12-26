import { Order } from "../model/order.model.js";
import { Product } from "../model/product.model.js";
import User from "../model/user.model.js";

//order controller
export const getUserOrders = async (request, response) => {
  try {
    const userId = request.body.userId;
    const orders = await Order.find({ user: userId }).populate(
      "products.product"
    );
    return response.status(200).json({ success: true, orders });
  } catch (error) {
    return response.status(500).json({ success: false, error: error.message });
  }
};
export const addOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { products } = req.body;
    let totalAmount = 0;
    for (const { productId, quantity } of products) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (quantity > product.stock) {
        return res
          .status(400)
          .json({ message: "Not enough stock for one or more products" });
      }
      product.stock -= quantity;
      await product.save();
      totalAmount += Number.parseFloat(product.price * quantity);
    }
    const order = new Order({
      user: userId,
      products: products.map(({ productId, quantity }) => ({
        product: productId,
        quantity,
      })),
      totalAmount,
    });
    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
