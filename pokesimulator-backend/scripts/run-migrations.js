import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const migrationsDir = path.resolve(__dirname, '../migrations')

const POSTGRES_HOST = process.env.POSTGRES_HOST || '127.0.0.1'
const POSTGRES_PORT = process.env.POSTGRES_PORT || '5432'
const POSTGRES_DB = process.env.POSTGRES_DB
const POSTGRES_USER = process.env.POSTGRES_USER
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD

const requiredEnv = [
    ['POSTGRES_DB', POSTGRES_DB],
    ['POSTGRES_USER', POSTGRES_USER],
    ['POSTGRES_PASSWORD', POSTGRES_PASSWORD]
]

const missingEnv = requiredEnv.filter(([, value]) => !value).map(([name]) => name)
if (missingEnv.length > 0) {
    console.error(`Missing required environment variables: ${missingEnv.join(', ')}`)
    process.exit(1)
}

const sqlLiteral = (value) => `'${String(value).replace(/'/g, "''")}'`

const runPsql = (sql, { tuplesOnly = false } = {}) =>
    new Promise((resolve, reject) => {
        const args = [
            '-h',
            POSTGRES_HOST,
            '-p',
            String(POSTGRES_PORT),
            '-U',
            POSTGRES_USER,
            '-d',
            POSTGRES_DB,
            '-v',
            'ON_ERROR_STOP=1',
            '-X'
        ]

        if (tuplesOnly) {
            args.push('-t', '-A')
        }

        args.push('-c', sql)

        const child = spawn('psql', args, {
            env: {
                ...process.env,
                PGPASSWORD: POSTGRES_PASSWORD
            }
        })

        let stdout = ''
        let stderr = ''

        child.stdout.on('data', (chunk) => {
            stdout += String(chunk)
        })

        child.stderr.on('data', (chunk) => {
            stderr += String(chunk)
        })

        child.on('error', (error) => {
            reject(new Error(`Failed to start psql: ${error.message}`))
        })

        child.on('close', (code) => {
            if (code === 0) {
                resolve(stdout.trim())
                return
            }

            const details = stderr.trim() || stdout.trim() || `psql exited with code ${code}`
            reject(new Error(details))
        })
    })

const queryClient = {
    query: async (sql) => runPsql(sql)
}

const ensureMigrationsTable = async () => {
    await queryClient.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename TEXT PRIMARY KEY,
            executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `)
}

const getAppliedMigrations = async () => {
    const output = await runPsql(`SELECT filename FROM schema_migrations ORDER BY filename`, {
        tuplesOnly: true
    })
    return new Set(
        output
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
    )
}

const listMigrationFiles = async () => {
    const files = await fs.readdir(migrationsDir)
    return files.filter((file) => file.endsWith('.js')).sort()
}

const applyPendingMigrations = async () => {
    await ensureMigrationsTable()
    const applied = await getAppliedMigrations()
    const files = await listMigrationFiles()

    const pending = files.filter((file) => !applied.has(file))

    if (pending.length === 0) {
        console.log('No pending migrations')
        return
    }

    for (const file of pending) {
        const fullPath = path.join(migrationsDir, file)
        const migration = await import(pathToFileURL(fullPath).href)

        if (typeof migration.up !== 'function') {
            throw new Error(`Migration ${file} is missing an exported 'up' function`)
        }

        console.log(`Applying migration: ${file}`)
        await migration.up(queryClient)
        await queryClient.query(`INSERT INTO schema_migrations (filename) VALUES (${sqlLiteral(file)})`)
    }

    console.log(`Applied ${pending.length} migration(s)`)
}

applyPendingMigrations().catch((error) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Migration failed: ${message}`)
    process.exit(1)
})
