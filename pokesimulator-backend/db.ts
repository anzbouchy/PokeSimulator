import net from 'node:net'

const parsePositiveInt = (value: string | undefined, fallback: number): number => {
    const parsed = Number(value)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

const POSTGRES_HOST = process.env.POSTGRES_HOST || '127.0.0.1'
const POSTGRES_PORT = parsePositiveInt(process.env.POSTGRES_PORT, 5432)
const DB_CONNECT_TIMEOUT_MS = parsePositiveInt(process.env.DB_CONNECT_TIMEOUT_MS, 5000)

export const connectToDatabase = async (): Promise<void> => {
    await new Promise<void>((resolve, reject) => {
        const socket = net.createConnection({
            host: POSTGRES_HOST,
            port: POSTGRES_PORT
        })

        const cleanup = () => {
            socket.removeAllListeners()
            socket.setTimeout(0)
        }

        socket.setTimeout(DB_CONNECT_TIMEOUT_MS)

        socket.once('connect', () => {
            cleanup()
            socket.end()
            resolve()
        })

        socket.once('timeout', () => {
            cleanup()
            socket.destroy()
            reject(
                new Error(
                    `Timed out connecting to PostgreSQL at ${POSTGRES_HOST}:${POSTGRES_PORT} after ${DB_CONNECT_TIMEOUT_MS}ms`
                )
            )
        })

        socket.once('error', (error) => {
            cleanup()
            socket.destroy()
            reject(new Error(`Failed to connect to PostgreSQL at ${POSTGRES_HOST}:${POSTGRES_PORT}: ${error.message}`))
        })
    })

    console.log(`Connected to PostgreSQL at ${POSTGRES_HOST}:${POSTGRES_PORT}`)
}
