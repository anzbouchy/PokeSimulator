import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cardRoutes from './routes/cards.js'
import { connectToDatabase } from './db.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
    res.json({ status: 'Backend running' })
})

app.use('/api/cards', cardRoutes)

const startServer = async () => {
    try {
        await connectToDatabase()

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown database connection error'
        console.error(`Server startup failed: ${message}`)
        process.exit(1)
    }
}

void startServer()
