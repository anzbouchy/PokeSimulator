import { RARITY_PRICE_RANGES_GBP } from './pricingRules.js'
import { RandomRangePricingProvider } from './providers/RandomRangePricingProvider.js'
import type { PricingProvider } from './types.js'

const DEFAULT_PRICING_PROVIDER = 'random-range'

export const createPricingProvider = (): PricingProvider => {
    const provider = (process.env.PRICING_PROVIDER || DEFAULT_PRICING_PROVIDER).trim().toLowerCase()

    if (provider === 'random-range') {
        return new RandomRangePricingProvider(RARITY_PRICE_RANGES_GBP)
    }

    console.warn(`Unknown PRICING_PROVIDER "${provider}", falling back to random-range`)
    return new RandomRangePricingProvider(RARITY_PRICE_RANGES_GBP)
}
