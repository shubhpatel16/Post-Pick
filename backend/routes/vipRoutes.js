import express from 'express'
import { checkVIP } from '../controllers/vipController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, checkVIP)

export default router