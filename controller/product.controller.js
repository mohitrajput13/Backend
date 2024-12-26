import { Product } from "../model/product.model.js";

export const deleteProduct = async (request, response, next) => {
  try {
    let id = request.params.id;
    let product = await Product.findOne({ _id: id });
    if (product) {
      await Product.deleteOne({ _id: id });
      return response.status(200).json({ message: "Product removed" });
    }
    return response.status(401).json({ error: "Bad request(id not found)" });
  } catch (err) {
    return response.status(500).json({ error: "Internal server error" });
  }
};

export const byCategory = (request, response, next) => {
  let category = request.params.category;
  Product.find({ category })
    .then((result) => {
      return response.status(200).json({ Result: result });
    })
    .catch((err) => {
      return response.status(402).json({ error: "Bad Request" });
    });
};

export const getById = async (request, response, next) => {
  let id = request.params.id;
  Product.findOne({ _id: id })
    .then((result) => {
      return response.status(200).json({ Product: result });
    })
    .catch((err) => {
      return response.status(500).json({ Massage: "Internal Server Error" });
    });
};

export const getProductList = async (req, res) => {
  try {
    const product = await Product.find().populate("category", "name");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// export const getProductList = (request,response,next) =>{
//     Product.find()
//     .then(result=>{
//         return response.status(200).json({products: result});
//     }).catch(err=>{
//         return response.status(500).json({error: "Internal server error"});
//     });
// }

// export const addOneProduct = (request, response, next) => {
//     let id = request.body.id;
//     console.log(id);
//     Product.findOne({ id }).then(product => {
//         if (product) {
//             return response.status(409).json({ Message: "Product Already Exists" });
//         } else {
//             Product.create(request.body).then(result => {
//                 return response.status(200).json({ Message: "Product Added Successfully" });
//             }).catch(err => {
//                 console.log(err)
//                 return response.status(500).json({ Message: "Internal Server Error" });
//             });
//         }
//     }).catch(err => {
//         console.log(err)
//         return response.status(500).json({ Message: "Internal Server Error" });
//     });
// }

export const addOneProduct = async (req, res) => {
  try {
    const { id, title, description, price, stock, brand } = req.body;
    let imageURL = req.file ? req.file.filename : null;
    console.log(imageURL);
    if (imageURL) {
      imageURL = imageURL.replace("public/images/", "images/");
    }
    console.log(imageURL, "++++++++++++++++++++++++++++++");
    const newProduct = new Product({
      id,
      title,
      description,
      price,
      stock,
      brand,
      imageURL,
    });
    await newProduct.save();
    return res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const saveInBulk = async (request, response, next) => {
  try {
    let productList = request.body;
    for (let p of productList) {
      await Product.create({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        stock: p.stock,
        brand: p.brand,
        category: p.category,
        imageURL: p.imageURL,
      });
    }
    return response.status(200).json({ massage: "product save succes" });
  } catch (err) {
    return response.status(500).json({ error: "Internal Server Error" });
  }
};
