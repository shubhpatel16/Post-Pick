import asyncHandler from '../middleware/asyncHandler.js';
import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }

  const exists = user.wishlist.find(
    (id) => id.toString() === productId
  );

  if (exists) {
    // REMOVE
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
  } else {
    // ADD (ONLY ObjectId, NOT product object)
    user.wishlist.push(productId);
  }

  await user.save();

  res.json(user.wishlist);
});
