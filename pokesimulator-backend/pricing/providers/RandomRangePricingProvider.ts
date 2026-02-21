import type { PriceRange, PricingProvider } from '../types.js'

export class RandomRangePricingProvider implements PricingProvider {
    private readonly rarityRanges: Record<string, PriceRange>

    constructor(rarityRanges: Record<string, PriceRange>) {
        this.rarityRanges = rarityRanges
    }

    getPriceForRarity(rarity: string | null | undefined): number | null {
        const key = String(rarity || '')
            .trim()
            .toLowerCase()
        const range = this.rarityRanges[key]

        if (!range) {
            return null
        }

        const value = Math.random() * (range.max - range.min) + range.min
        return Number(value.toFixed(2))
    }
}
