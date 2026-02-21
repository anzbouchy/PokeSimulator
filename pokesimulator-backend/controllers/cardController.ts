import TCGdex, { type Card as TCGCard } from '@tcgdex/sdk'
import type { Request, Response } from 'express'

const tcgdex = new TCGdex('en')

const DEFAULT_SLOT9_WEIGHTS: Record<string, number> = {
    Rare: 0.7,
    'Double rare': 0.2,
    'ACE SPEC Rare': 0.1
}

const DEFAULT_SLOT10_WEIGHTS: Record<string, number> = {
    Rare: 0.67,
    'Double rare': 0.22,
    'ACE SPEC Rare': 0.08,
    'Illustration rare': 0.08,
    'Ultra Rare': 0.05,
    'Special illustration rare': 0.03,
    'Hyper rare': 0.015
}

const normalizeSetId = (value: unknown): string => {
    return String(value || '').trim()
}

const pickWeightedRarity = (weights: Record<string, number>): string | null => {
    const entries = Object.entries(weights).filter(([, weight]) => Number(weight) > 0)

    if (entries.length === 0) {
        return null
    }

    const total = entries.reduce((sum, [, weight]) => sum + Number(weight), 0)
    const threshold = Math.random() * total

    let cumulative = 0
    for (const [rarity, weight] of entries) {
        cumulative += Number(weight)
        if (threshold <= cumulative) {
            return rarity
        }
    }

    return entries[entries.length - 1][0]
}

const drawFromPool = (
    cards: TCGCard[],
    predicate: (card: TCGCard) => boolean,
    usedCardIds: Set<string>
): TCGCard | null => {
    const pool = cards.filter((card) => predicate(card) && !usedCardIds.has(card.id))
    if (pool.length === 0) {
        return null
    }

    const chosen = pool[Math.floor(Math.random() * pool.length)]
    usedCardIds.add(chosen.id)
    return chosen
}

const drawByRarity = (cards: TCGCard[], usedCardIds: Set<string>, weights: Record<string, number>): TCGCard | null => {
    const availableWeights = Object.fromEntries(
        Object.entries(weights).filter(
            ([rarity, weight]) =>
                Number(weight) > 0 && cards.some((card) => card.rarity === rarity && !usedCardIds.has(card.id))
        )
    )

    const targetRarity = pickWeightedRarity(availableWeights)

    if (targetRarity) {
        return drawFromPool(cards, (card) => card.rarity === targetRarity, usedCardIds)
    }

    return null
}

const getSetCards = async (setId: string): Promise<TCGCard[]> => {
    const set = await tcgdex.fetch('sets', setId)

    if (!set || !Array.isArray(set.cards) || set.cards.length === 0) {
        return []
    }

    const cardIds = set.cards
        .map((card) => (typeof card === 'string' ? card : card.id))
        .filter(Boolean)

    const fetchedCards = await Promise.all(
        cardIds.map(async (id) => {
            try {
                return await tcgdex.fetch('cards', id)
            } catch {
                return null
            }
        })
    )

    return fetchedCards.filter((card): card is TCGCard => Boolean(card && card.id))
}

export const getCardById = async (req: Request, res: Response) => {
    try {
        const cardIdParam = req.params.cardId
        const cardId = Array.isArray(cardIdParam) ? cardIdParam[0] : cardIdParam

        if (!cardId) {
            return res.status(400).json({ error: 'cardId is required' })
        }

        const card = await tcgdex.fetchCard(cardId)

        if (!card) {
            return res.status(404).json({ error: 'Card not found' })
        }

        return res.json(card)
    } catch {
        return res.status(500).json({ error: 'Failed to fetch card' })
    }
}

export const openPack = async (req: Request, res: Response) => {
    try {
        const setId = normalizeSetId(req.body?.setId)

        if (!setId) {
            return res.status(400).json({ error: 'setId is required' })
        }

        const setCards = await getSetCards(setId)

        if (setCards.length === 0) {
            return res.status(404).json({ error: `No cards found for set ${setId}` })
        }

        const usedCardIds = new Set<string>()
        const pack: TCGCard[] = []

        const addCard = (card: TCGCard | null, slotDescription: string) => {
            if (!card) {
                throw new Error(`Missing card for slot: ${slotDescription}`)
            }
            pack.push(card)
        }

        for (let index = 0; index < 4; index += 1) {
            addCard(drawFromPool(setCards, (card) => card.rarity === 'Common', usedCardIds), 'Common')
        }

        for (let index = 0; index < 3; index += 1) {
            addCard(drawFromPool(setCards, (card) => card.rarity === 'Uncommon', usedCardIds), 'Uncommon')
        }

        addCard(drawFromPool(setCards, (card) => card.rarity === 'Rare', usedCardIds), 'Guaranteed Rare')

        addCard(
            drawByRarity(setCards, usedCardIds, DEFAULT_SLOT9_WEIGHTS),
            'Weighted Rare/Double Rare/ACE SPEC Rare'
        )

        addCard(drawByRarity(setCards, usedCardIds, DEFAULT_SLOT10_WEIGHTS), 'Weighted high-rarity slot')

        const cardsWithImages = await Promise.all(
            pack.map(async (card) => {
                let image: string | null = null
                const cardWithPricing = card as TCGCard & {
                    pricing?: {
                        cardmarket?: {
                            idProduct?: number
                        }
                    }
                }

                try {
                    const cardModel = await tcgdex.card.get(card.id)
                    if (cardModel) {
                        image = cardModel.getImageURL('high', 'png')
                    }
                } catch {
                    image = null
                }

                return {
                    id: card.id,
                    cardmarketId: cardWithPricing.pricing?.cardmarket?.idProduct ?? null,
                    image
                }
            })
        )

        return res.json(cardsWithImages)
    } catch (error) {
        return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to open pack' })
    }
}