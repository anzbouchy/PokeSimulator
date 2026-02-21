import express from 'express'
import { getCardById, openPack } from '../controllers/cardController.js'

const router = express.Router()

router.post('/pack', openPack)
router.get('/:cardId', getCardById)

export default router