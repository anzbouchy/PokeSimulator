import type { PriceRange, PricingProvider, Price } from '../types.js'

export class RandomRangePricingProvider implements PricingProvider {
    private readonly rarityRanges: Record<string, PriceRange>
    private readonly currency: string

    constructor(rarityRanges: Record<string, PriceRange>, currency: string) {
        this.rarityRanges = rarityRanges
        this.currency = currency
    }

    getPriceForRarity(rarity: string | null | undefined): Price | null {
        const key = String(rarity || '')
            .trim()
            .toLowerCase()
        const range = this.rarityRanges[key]

        if (!range) {
            return null
        }

        const value = Math.random() * (range.max - range.min) + range.min
        return {
            amount: Number(value.toFixed(2)),
            currency: this.currency
        }
    }
}
