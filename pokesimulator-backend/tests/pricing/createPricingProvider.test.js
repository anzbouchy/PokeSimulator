import assert from 'node:assert/strict'
import test from 'node:test'
import { createPricingProvider } from '../../dist/pricing/index.js'

const withEnv = async (values, callback) => {
    const previousValues = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]))

    for (const [key, value] of Object.entries(values)) {
        if (value === undefined) {
            delete process.env[key]
        } else {
            process.env[key] = value
        }
    }

    try {
        await callback()
    } finally {
        for (const [key, value] of Object.entries(previousValues)) {
            if (value === undefined) {
                delete process.env[key]
            } else {
                process.env[key] = value
            }
        }
    }
}

const withMockedRandom = async (randomValue, callback) => {
    const originalRandom = Math.random
    Math.random = () => randomValue

    try {
        await callback()
    } finally {
        Math.random = originalRandom
    }
}

test('uses GBP currency by default', async () => {
    await withEnv(
        {
            PRICING_PROVIDER: undefined,
            PRICING_CURRENCY: undefined
        },
        async () => {
            const provider = createPricingProvider()

            await withMockedRandom(0, () => {
                assert.deepEqual(provider.getPriceForRarity('rare'), {
                    amount: 0.2,
                    currency: 'GBP'
                })
            })
        }
    )
})

test('uses PRICING_CURRENCY when provided', async () => {
    await withEnv(
        {
            PRICING_PROVIDER: 'random-range',
            PRICING_CURRENCY: 'usd'
        },
        async () => {
            const provider = createPricingProvider()

            await withMockedRandom(0, () => {
                assert.deepEqual(provider.getPriceForRarity('common'), {
                    amount: 0.05,
                    currency: 'USD'
                })
            })
        }
    )
})

test('falls back to random-range provider when PRICING_PROVIDER is unknown', async () => {
    await withEnv(
        {
            PRICING_PROVIDER: 'unknown-provider',
            PRICING_CURRENCY: 'gbp'
        },
        async () => {
            const originalWarn = console.warn
            let warningMessage = ''

            console.warn = (message) => {
                warningMessage = String(message ?? '')
            }

            try {
                const provider = createPricingProvider()
                const price = provider.getPriceForRarity('common')

                assert.ok(price)
                assert.equal(price.currency, 'GBP')
                assert.match(warningMessage, /Unknown PRICING_PROVIDER/)
            } finally {
                console.warn = originalWarn
            }
        }
    )
})
