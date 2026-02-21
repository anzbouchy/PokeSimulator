import express from 'express'
import cors from 'cors'
import cardRoutes from './routes/cards.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
    res.json({ status: 'Backend running' })
})

app.use('/api/cards', cardRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})