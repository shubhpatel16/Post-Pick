import express from 'express';
import { chatAssistant } from '../controllers/aiChatController.js';

const router = express.Router();

router.post('/chat', chatAssistant);

export default router;