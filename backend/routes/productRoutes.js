import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getProductRecommendations,
  getTrendingProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';
import Product from '../models/productModel.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router.get('/trending', getTrendingProducts);
router.post('/recently-viewed', async (req, res) => {
  const ids = req.body.ids;

  const products = await Product.find({
    _id: { $in: ids },
  });

  res.json(products);
});
router.get('/:id/recommendations', getProductRecommendations);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

export default router;
