import { Cart } from "../model/cart.model.js"
export const removeCart = async (request, response, next) => {
    let { userId, productId } = request.body;
    Cart.updateOne({ userId }, {
        $pull: { cartItems: { productId } }
    })
        .then(result => {
            if (result.modifiedCount)
                return response.status(200).json({ message: "Item removed from cart" });
            return response.status(401).json({ error: "Bad request (Id not found)" });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal Server Error" });
        });
}
export const fetchCart = async (request, response, next) => {
    let userId = request.body.userId;
    try {
        console.log(userId)
        const userCart = await Cart.findOne({ userId: userId }).populate({
            path: "cartItems.productId",
            populate: {
                path: "category",
                model: "AyurvedaCategory"
            }
        });
        if (!userCart) {
            return response.status(404).json({ error: "Cart not found for the user" });
        }
        return response.status(200).json({ cart: userCart });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal server error" });
    }
}
export const addToCart = async (request, response, next) => {
    try {
        let { userId, productId } = request.body;
        let cart = await Cart.findOne({ userId });
        if (cart) {
            let status = cart.cartItems.some((product) => product.productId == productId);
            if (status) {
                return response.status(200).json({ message: "product already added" });
            }
            else {
                cart.cartItems.push({ productId, quantity: 1 });
                await cart.save();
                return response.status(200).json({ message: "add to cart" });
            }
        }
        else {
            console.log(productId);
            cart = Cart.create({ userId, cartItems: [{ productId: productId, quantity: 1 }] });
            return response.status(200).json({ message: "add to cart" });
        }
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Internal Server Error In Cart Model" });
    }
}
export const productQuantity = async (request, response, next) => {
    try {
        let { userId, productId, quantity } = request.body;
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return response.status(404).json({ error: "Cart not found" });
        }

        let productIndex = cart.cartItems.findIndex(item => item.productId == productId);
        console.log("Product ID:", productId);
        console.log("Cart Items:", cart.cartItems);
        console.log("Product Index:", productIndex);

        if (productIndex == -1) {
            return response.status(404).json({ error: "Product not found in cart" });
        }

        cart.cartItems[productIndex].quantity=Number.parseInt(cart.cartItems[productIndex].quantity) + Number.parseInt(quantity);
        
        if (cart.cartItems[productIndex].quantity <= 0) {
            cart.cartItems.splice(productIndex, 1);
        }
        
        await cart.save();
        return response.status(200).json({ message: "Product quantity updated successfully" });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Internal Server Error" });
    }
}
