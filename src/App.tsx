import { useEffect, useState, type ChangeEvent } from 'react'
import './App.css'
import AppHeader from './components/AppHeader'
import BoosterPackView from './components/BoosterPackView'
import PackEconomics from './components/PackEconomics'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const SET_OPTIONS = [
    { label: 'Prismatic Evolutions', value: 'sv08.5' },
    { label: 'Journey Together', value: 'sv09' },
    { label: 'Destined Rivals', value: 'sv10' }
] as const

const THEME_BY_SET: Record<string, 'prismatic' | 'journey' | 'destined'> = {
    'sv08.5': 'prismatic',
    sv09: 'journey',
    sv10: 'destined'
}

const DEFAULT_PACK_COST = 4.99

const PACK_COST_BY_SET: Record<string, number> = {
    'sv08.5': 2.10,
    'sv09': 4.49,
    'sv10': 5.00
}

type Card = {
    id: string
    cardmarketId?: number
    image: string
    rarity?: string
    color?: string
    secondaryColor?: string
    emoji?: string
    isPrismatic?: boolean
    pullId?: string
    price?: string
}

function App() {
    const [revealedCards, setRevealedCards] = useState<Card[]>([])
    const [openedCards, setOpenedCards] = useState<Card[]>([])
    const [cardsOpenedCount, setCardsOpenedCount] = useState<number>(0)
    const [packCards, setPackCards] = useState<Card[]>([])
    const [packIndex, setPackIndex] = useState<number>(0)
    const [selectedSetId, setSelectedSetId] = useState<string>('sv08.5')

    const selectedSetName = SET_OPTIONS.find((setOption) => setOption.value === selectedSetId)?.label ?? 'Unknown Set'

    useEffect(() => {
        const theme = THEME_BY_SET[selectedSetId] ?? 'default'
        document.body.setAttribute('data-theme', theme)
    }, [selectedSetId])
    const currentPackCost = PACK_COST_BY_SET[selectedSetId] ?? DEFAULT_PACK_COST

    const handleSetChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedSetId(event.target.value)
        resetSession()
    }

    const openBoosterPack = async () => {
        try {
            // If we already have a full pack cached, just show the next card
            if (packCards.length > 0 && packIndex < packCards.length) {
                const baseCard = packCards[packIndex]
                const pulledCard: Card = {
                    ...baseCard,
                    pullId: `${baseCard.id}-${Date.now()}-${Math.random()}`
                }

                setOpenedCards((prev) => [...prev, pulledCard])
                setCardsOpenedCount((prev) => prev + 1)
                setPackIndex((prev) => prev + 1)
                setRevealedCards([pulledCard])

                return
            }

            // If we've already shown all cards in the cached pack, do nothing
            if (packCards.length > 0 && packIndex >= packCards.length) {
                return
            }

            // First time: fetch one pack of cards from the backend
            let pack: Card[] | null = null

            try {
                const response = await fetch(`${BACKEND_URL}/api/cards/pack`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ setId: selectedSetId })
                })

                if (response.ok) {
                    pack = await response.json()
                } else {
                    console.error('Backend pack error:', response.status)
                }
            } catch (error) {
                console.error('Backend pack request failed:', error)
            }

            if (!Array.isArray(pack) || pack.length === 0) {
                return
            }

            // Only keep the API response fields we care about, plus simple display defaults
            const transformedPack: Card[] = pack.map((rawCard: any) => ({
                id: rawCard.id,
                cardmarketId: rawCard.cardmarketId,
                image: rawCard.image,
                rarity: rawCard.rarity,
                price:
                    typeof rawCard.price?.amount === 'number'
                        ? `$${rawCard.price.amount.toFixed(2)}`
                        : typeof rawCard.price === 'string'
                            ? rawCard.price
                            : undefined,
                // minimal extra fields for display
                color: '#1b2230',
                secondaryColor: '#3a4b6a',
                emoji: '⭐',
                isPrismatic: false
            }))

            setPackCards(transformedPack)
            setPackIndex(0)

            // Immediately show the first card from the new pack
            const firstCard = transformedPack[0]
            const pulledCard: Card = {
                ...firstCard,
                pullId: `${firstCard.id}-${Date.now()}-${Math.random()}`
            }

            setOpenedCards([pulledCard])
            setCardsOpenedCount(1)
            setPackIndex(1)
            setRevealedCards([pulledCard])
        } catch (error) {
            console.error('Error opening pack from backend:', error)
        }
    }

    const currentCard = revealedCards[0]
    const isPackComplete = packCards.length > 0 && packIndex >= packCards.length

    const resetSession = () => {
        setRevealedCards([])
        setOpenedCards([])
        setCardsOpenedCount(0)
        setPackCards([])
        setPackIndex(0)
    }

    const calculateTotalPrice = () => {
        return openedCards.reduce((total, card) => {
            if (card.price && card.price !== 'N/A') {
                const price = parseFloat(card.price.replace('$', ''))
                return total + (isNaN(price) ? 0 : price)
            }
            return total
        }, 0)
    }

    return (
        <div className="app">
            <AppHeader
                setOptions={SET_OPTIONS}
                selectedSetId={selectedSetId}
                cardsOpenedCount={cardsOpenedCount}
                onSetChange={handleSetChange}
                onResetSession={resetSession}
            />

            <main className="main-content">
                <BoosterPackView
                    cardsOpenedCount={cardsOpenedCount}
                    isPackComplete={isPackComplete}
                    openedCards={openedCards}
                    selectedSetId={selectedSetId}
                    selectedSetName={selectedSetName}
                    currentCard={currentCard}
                    onOpenBoosterPack={openBoosterPack}
                    onResetSession={resetSession}
                />

                <PackEconomics
                    packCost={currentPackCost}
                    revealedValue={calculateTotalPrice()}
                    cardsRevealed={cardsOpenedCount}
                />
            </main>
        </div>
    )
}

export default App
