import { RARITY_PRICE_RANGES_GBP } from './pricingRules.js'
import { RandomRangePricingProvider } from './providers/RandomRangePricingProvider.js'
import type { PricingProvider } from './types.js'

const DEFAULT_PRICING_PROVIDER = 'random-range'
const DEFAULT_CURRENCY = 'GBP'

export const createPricingProvider = (): PricingProvider => {
    const provider = (process.env.PRICING_PROVIDER || DEFAULT_PRICING_PROVIDER).trim().toLowerCase()
    const currency = (process.env.PRICING_CURRENCY || DEFAULT_CURRENCY).trim().toUpperCase()

    if (provider === 'random-range') {
        return new RandomRangePricingProvider(RARITY_PRICE_RANGES_GBP, currency)
    }

    console.warn(`Unknown PRICING_PROVIDER "${provider}", falling back to random-range`)
    return new RandomRangePricingProvider(RARITY_PRICE_RANGES_GBP, currency)
}
