import assert from 'node:assert/strict'
import test from 'node:test'
import { RandomRangePricingProvider } from '../../dist/pricing/providers/RandomRangePricingProvider.js'

const PRICE_RANGES = {
    common: { min: 0.05, max: 0.5 },
    rare: { min: 0.2, max: 2 }
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

test('returns null for unknown rarity', () => {
    const provider = new RandomRangePricingProvider(PRICE_RANGES, 'GBP')
    assert.equal(provider.getPriceForRarity('Unknown rarity'), null)
})

test('returns minimum amount when random is 0', async () => {
    const provider = new RandomRangePricingProvider(PRICE_RANGES, 'GBP')

    await withMockedRandom(0, () => {
        assert.deepEqual(provider.getPriceForRarity('common'), {
            amount: 0.05,
            currency: 'GBP'
        })
    })
})

test('returns maximum amount when random is 1', async () => {
    const provider = new RandomRangePricingProvider(PRICE_RANGES, 'GBP')

    await withMockedRandom(1, () => {
        assert.deepEqual(provider.getPriceForRarity('common'), {
            amount: 0.5,
            currency: 'GBP'
        })
    })
})

test('normalizes rarity casing and whitespace', async () => {
    const provider = new RandomRangePricingProvider(PRICE_RANGES, 'GBP')

    await withMockedRandom(0, () => {
        assert.deepEqual(provider.getPriceForRarity('  RARE  '), {
            amount: 0.2,
            currency: 'GBP'
        })
    })
})
