import { AyurvedaCategory } from "../model/AyurvedaCategory.model.js";

export const saveCategoriesBulk = async (req, res) => {
  const categories = req.body;
  try {
    const savedCategories = await AyurvedaCategory.insertMany(categories);
    return res.status(201).json(savedCategories);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Add one category
export const addCategory = async (req, res) => {
  const category = new AyurvedaCategory({
    name: req.body.name
  });

  try {
    const newCategory = await category.save();
    return res.status(201).json(newCategory);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await AyurvedaCategory.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.json({ message: 'Category deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await AyurvedaCategory.find();
    return res.status(200).json({categories});
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
