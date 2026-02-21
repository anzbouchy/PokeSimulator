export type PriceRange = {
    min: number
    max: number
}

export type Price = {
    amount: number
    currency: string
}

export interface PricingProvider {
    getPriceForRarity(rarity: string | null | undefined): Price | null
}
