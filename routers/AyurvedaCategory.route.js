import express from 'express';
import { addCategory, deleteCategory, getCategories, saveCategoriesBulk } from '../controller/AyurvedaCategory.controller.js';
const router=express.Router();

router.post('/save-in-bulk',saveCategoriesBulk);
router.post('/add-one',addCategory);
router.delete('/delete-category',deleteCategory);
router.get('/get-category',getCategories);
export default router;