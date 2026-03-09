import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import adminRoutes from './routes/adminRoutes.js';
import aiSearchRoutes from './routes/aiSearchRoutes.js';
import aiChatRoutes from './routes/aiChatRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import couponRoutes from "./routes/couponRoutes.js";
import vipRoutes from "./routes/vipRoutes.js";

const port = process.env.PORT || 5001;

connectDB();

const app = express();
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/search', aiSearchRoutes);
app.use('/api/ai', aiChatRoutes);
app.use('/api/payments', stripeRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/vip", vipRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

if (process.env.NODE_ENV === 'production') {
  const rootDir = path.resolve(__dirname, '..');

  app.use(express.static(path.join(rootDir, 'frontend', 'build')));

  app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) return;
    res.sendFile(
      path.resolve(rootDir, 'frontend', 'build', 'index.html')
    );
  });
} else {
  const __dirname = path.resolve();
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`),
);
