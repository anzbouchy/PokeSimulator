import { useState } from 'react'
import './App.css'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

type Card = {
    id: string
    cardmarketId?: number
    image: string
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
    const [showSummary, setShowSummary] = useState<boolean>(false)
    const [packCards, setPackCards] = useState<Card[]>([])
    const [packIndex, setPackIndex] = useState<number>(0)

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

            // If we've already shown all cards in the cached pack, show summary
            if (packCards.length > 0 && packIndex >= packCards.length) {
                setShowSummary(true)
                setRevealedCards([])
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
                    body: JSON.stringify({ setId: 'sv8pt5' })
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

    const resetSession = () => {
        setRevealedCards([])
        setOpenedCards([])
        setCardsOpenedCount(0)
        setShowSummary(false)
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
            <header className="app-header">
                <h1 className="title">🌈 Poke Simulator</h1>
                {/* Set info removed since we now rely only on backend images */}
                <div className="card-counter">
                    <span>Cards Opened: {cardsOpenedCount}/10</span>
                    {cardsOpenedCount > 0 && (
                        <button className="reset-btn" onClick={resetSession}>
                            🔄
                        </button>
                    )}
                </div>
            </header>
			
            <main className="main-content">
                <>
                    <section className="pack-opening-section">
                        {showSummary ? (
                            // Summary view after 10 cards
                            <div className="summary-container">
                                <div className="summary-header">
                                    <h2>🎉 Pack Opening Complete!</h2>
                                    <p>You've opened all 10 cards from your booster packs!</p>
                                </div>
                                <div className="summary-stats">
                                    <div className="stat-card total-cards">
                                        <div className="stat-icon">📦</div>
                                        <div className="stat-info">
                                            <h3>Total Cards</h3>
                                            <span className="stat-number">{openedCards.length}</span>
                                        </div>
                                    </div>
                                    <div className="stat-card total-value">
                                        <div className="stat-icon">💰</div>
                                        <div className="stat-info">
                                            <h3>Total Value</h3>
                                            <span className="stat-number">${calculateTotalPrice().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="summary-actions">
                                    <button className="start-over-btn" onClick={resetSession}>
                                        🔄 Start New Session
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Individual pack opening view
                            <div className="booster-pack-container">
                                {cardsOpenedCount === 0 ? (
                                    <div className="unopened-pack">
                                        <div className="pack-wrapper">
                                            <div className="booster-pack" onClick={openBoosterPack}>
                                                <div className="pack-art">
                                                    <div className="set-logo">
                                                        <h3>Prismatic Evolutions</h3>
                                                        <div className="pack-shine"></div>
                                                    </div>
                                                    <div className="pack-details">
                                                        <span>Scarlet & Violet</span>
                                                        <span>1 Card Pack</span>
                                                        <span className="click-hint">✨ Click to Open ✨</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="opened-pack">
                                        <div className="pack-results">
                                            <div className="single-card-container">
                                                {/* Show the revealed Pokemon card directly - click to reveal next card */}
                                                {revealedCards.length > 0 && revealedCards[0].image && (
                                                    <div className="revealed-pokemon-card">
                                                        <div className="clickable-pokemon-card" onClick={openBoosterPack}>
                                                            <img
                                                                src={revealedCards[0].image}
                                                                alt={revealedCards[0].id || 'Card'}
                                                                className="pokemon-art"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
					
                    {/* Evolution tree and history removed for a simpler image-only view */}
                </>
            </main>
        </div>
    )
}

export default App