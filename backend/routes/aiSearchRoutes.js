import express from 'express';
import { smartSearch } from '../controllers/aiSearchController.js';

const router = express.Router();

router.post('/smart-search', smartSearch);

export default router;