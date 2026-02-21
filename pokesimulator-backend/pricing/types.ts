export type PriceRange = {
    min: number
    max: number
}

export interface PricingProvider {
    getPriceForRarity(rarity: string | null | undefined): number | null
}
