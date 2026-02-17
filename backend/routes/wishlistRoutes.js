import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';

router.put('/:productId', protect, async (req, res) => {
  if (!req.user) {
  res.status(401);
  throw new Error('Not authorized, user missing');
}

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const productId = req.params.productId;

  if (user.wishlist.includes(productId)) {
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  res.json(user.wishlist);
});

export default router;
