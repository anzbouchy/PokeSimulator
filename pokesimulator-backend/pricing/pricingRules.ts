import type { PriceRange } from './types.js'

export const RARITY_PRICE_RANGES_GBP: Record<string, PriceRange> = {
    common: { min: 0.05, max: 0.5 },
    uncommon: { min: 0.05, max: 1 },
    rare: { min: 0.2, max: 2 },
    'double rare': { min: 1, max: 10 },
    'ace spec rare': { min: 0.4, max: 2 },
    'ultra rare': { min: 5, max: 30 },
    'illustration rare': { min: 10, max: 80 },
    'special illustration rare': { min: 100, max: 1000 },
    'hyper rare': { min: 20, max: 200 }
}
