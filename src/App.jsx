import { useState, useEffect } from 'react'
import './App.css'
import PokemonCard from './components/PokemonCard'
import EvolutionTree from './components/EvolutionTreeTCG'
import tcgdx from './services/tcgdx'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Helper functions for transforming TCG API data
function getEmojiForPokemon(name) {
  const emojiMap = {
    'Caterpie': '🐛',
    'Pikachu': '⚡',
    'Charizard': '🔥',
    'Eevee': '🦊',
    'Vaporeon': '🌊',
    'Jolteon': '⚡',
    'Flareon': '🔥',
    'Leafeon': '🍃',
    'Espeon': '🔮',
    'Umbreon': '🌙',
    'Glaceon': '❄️',
    'Sylveon': '🎀'
  }
  
  // Remove ex, VMAX, etc. suffixes
  const baseName = name.replace(/ (ex|VMAX|V|GX).*$/, '')
  return emojiMap[baseName] || '⭐'
}

function getColorForType(type) {
  const colorMap = {
    'Fire': '#F08030',
    'Water': '#6890F0', 
    'Grass': '#78C850',
    'Lightning': '#F8D030',
    'Psychic': '#F85888',
    'Fighting': '#C03028',
    'Darkness': '#705848',
    'Metal': '#B8B8D0',
    'Fairy': '#EE99AC',
    'Dragon': '#7038F8',
    'Colorless': '#A8A878'
  }
  return colorMap[type] || '#A8A878'
}

function getSecondaryColor(type) {
  const colorMap = {
    'Fire': '#FF6B6B',
    'Water': '#4ECDC4',
    'Grass': '#A8E6A3',
    'Lightning': '#FFC107',
    'Psychic': '#FFB3D1',
    'Fighting': '#FF6B6B',
    'Darkness': '#8B7355',
    'Metal': '#D0D0E0',
    'Fairy': '#F8BBD0',
    'Dragon': '#9D5FCB',
    'Colorless': '#C4A484'
  }
  return colorMap[type] || '#C4A484'
}

function getAttackPower(attacks) {
  if (!attacks || attacks.length === 0) return 0
  
  // Find the highest damage attack
  let maxDamage = 0
  attacks.forEach(attack => {
    if (attack.damage) {
      let damage = 0
      if (typeof attack.damage === 'number') {
        damage = attack.damage
      } else {
        damage = parseInt(String(attack.damage).replace(/[^0-9]/g, '')) || 0
      }
      maxDamage = Math.max(maxDamage, damage)
    }
  })
  
  return maxDamage
}

function getSpeedFromRetreat(retreatCost) {
  // Higher retreat cost = lower speed
  const baseCost = retreatCost || 0
  return Math.max(20, 100 - (baseCost * 20))
}

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [prismaticEnergy, setPrismaticEnergy] = useState(100)
  const [revealedCards, setRevealedCards] = useState([])
  const [evolutionHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [setInfo, setSetInfo] = useState(null)
  const [packOpened, setPackOpened] = useState(false)
  const [openedCards, setOpenedCards] = useState([])
  const [cardsOpenedCount, setCardsOpenedCount] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const [packCards, setPackCards] = useState([])
  const [packIndex, setPackIndex] = useState(0)

  useEffect(() => {
    async function loadPrismaticEvolutions() {
      try {
        setLoading(true)
        // Fetch Prismatic Evolutions set (sv4pt5 is the set code)
        const set = await tcgdx.set.get('sv4pt5')
        
        setSetInfo(set)
        
        // Start with no card shown (pack not opened)
        setPackOpened(false)
      } catch (error) {
        console.error('Error loading cards:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPrismaticEvolutions()
  }, [])

  const openBoosterPack = async () => {
    try {
      // If we already have a full pack cached, just show the next card
      if (packCards.length > 0 && packIndex < packCards.length) {
        const baseCard = packCards[packIndex]
        const pulledCard = {
          ...baseCard,
          pullId: `${baseCard.id}-${Date.now()}-${Math.random()}`
        }

        setOpenedCards((prev) => [...prev, pulledCard])
        setCardsOpenedCount((prev) => prev + 1)
        setPackIndex((prev) => prev + 1)
        setRevealedCards([pulledCard])
        setSelectedPokemon(pulledCard)
        setPackOpened(true)

        if (
          pulledCard.rarity?.includes('Ultra') ||
          pulledCard.rarity?.includes('Hyper') ||
          pulledCard.rarity?.includes('Secret')
        ) {
          setPrismaticEnergy((prev) => Math.min(100, prev + 5))
        }

        return
      }

      // If we've already shown all cards in the cached pack, show summary
      if (packCards.length > 0 && packIndex >= packCards.length) {
        setShowSummary(true)
        setRevealedCards([])
        setSelectedPokemon(null)
        setPackOpened(true)
        return
      }

      // First time: try to fetch one pack of cards from the backend
      let pack = null

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

      // Fallback: if backend failed, use first 10 cards from tcgdx set
      if (!Array.isArray(pack) || pack.length === 0) {
        try {
          const fallbackSet = await tcgdx.set.get('sv4pt5')
          if (fallbackSet && Array.isArray(fallbackSet.cards) && fallbackSet.cards.length > 0) {
            pack = fallbackSet.cards.slice(0, 10).map((card) => ({
              id: card.id,
              name: card.name,
              hp: card.hp,
              types: card.types,
              attacks: card.attacks,
              rarity: card.rarity,
              number: card.number,
              set: { name: fallbackSet.name },
              image: card.images?.large || card.images?.small || null
            }))
          }
        } catch (error) {
          console.error('Fallback pack build failed:', error)
        }
      }

      if (!Array.isArray(pack) || pack.length === 0) {
        return
      }

      const transformedPack = pack.map((rawCard) => ({
        id: rawCard.id,
        name: rawCard.name,
        emoji: getEmojiForPokemon(rawCard.name || ''),
        image: rawCard.image || null,
        types: rawCard.types && rawCard.types.length > 0 ? rawCard.types : ['Colorless'],
        color: getColorForType(rawCard.types?.[0] || 'Colorless'),
        secondaryColor: getSecondaryColor(rawCard.types?.[0] || 'Colorless'),
        stats: {
          hp: parseInt(rawCard.hp) || 0,
          attack: getAttackPower(rawCard.attacks),
          defense: 50,
          speed: getSpeedFromRetreat(rawCard.convertedRetreatCost || 0)
        },
        rarity: rawCard.rarity,
        cardNumber: rawCard.number,
        price: 'N/A',
        isPrismatic:
          rawCard.rarity?.includes('Ultra') ||
          rawCard.rarity?.includes('Hyper') ||
          rawCard.rarity?.includes('Secret'),
        pattern: rawCard.rarity?.includes('Ultra')
          ? 'ultra'
          : rawCard.rarity?.includes('Secret')
          ? 'secret'
          : null,
        artist: rawCard.artist,
        setName: rawCard.set?.name,
        flavorText: rawCard.flavorText || 'A mysterious Pokemon card with incredible power.'
      }))

      setPackCards(transformedPack)
      setPackIndex(0)

      // Immediately show the first card from the new pack
      const firstCard = transformedPack[0]
      const pulledCard = {
        ...firstCard,
        pullId: `${firstCard.id}-${Date.now()}-${Math.random()}`
      }

      setOpenedCards([pulledCard])
      setCardsOpenedCount(1)
      setPackIndex(1)
      setRevealedCards([pulledCard])
      setSelectedPokemon(pulledCard)
      setPackOpened(true)

      if (
        pulledCard.rarity?.includes('Ultra') ||
        pulledCard.rarity?.includes('Hyper') ||
        pulledCard.rarity?.includes('Secret')
      ) {
        setPrismaticEnergy((prev) => Math.min(100, prev + 5))
      }
    } catch (error) {
      console.error('Error opening pack from backend:', error)
    }
  }
  

  const resetSession = () => {
    setSelectedPokemon(null)
    setRevealedCards([])
    setPackOpened(false)
    setOpenedCards([])
    setCardsOpenedCount(0)
    setShowSummary(false)
    setPrismaticEnergy(100)
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
        {setInfo && (
          <div className="set-info">
            <span className="set-name">{setInfo.name}</span>
            <span className="set-series">{setInfo.series}</span>
            <span className="set-total">{setInfo.total} cards</span>
          </div>
        )}
        {/* <div className="energy-bar">
          <span>Prismatic Energy: </span>
          <div className="energy-container">
            <div 
              className="energy-fill" 
              style={{ width: `${prismaticEnergy}%` }}
            ></div>
            <span className="energy-text">{prismaticEnergy}/100</span>
          </div>
        </div> */}
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
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading Prismatic Evolutions cards...</p>
          </div>
        ) : (
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
                          {revealedCards.length > 0 && (
                            <div className="revealed-pokemon-card">
                              <div className="clickable-pokemon-card" onClick={openBoosterPack}>
                                <PokemonCard 
                                  pokemon={revealedCards[0]}
                                  onClick={() => {}} // Prevent double click handling
                                  isSelected={false}
                                  onEvolution={() => {}}
                                  prismaticEnergy={prismaticEnergy}
                                  isRevealed={true}
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
            
            {selectedPokemon && packOpened && (
              <section className="evolution-section">
                <EvolutionTree 
                  pokemon={selectedPokemon}
                  onEvolution={() => {}}
                  prismaticEnergy={prismaticEnergy}
                />
              </section>
            )}
            
            {evolutionHistory.length > 0 && (
              <section className="evolution-log">
                <h3>Evolution History</h3>
                <div className="evolution-entries">
                  {evolutionHistory.slice(-5).reverse().map((entry, index) => (
                    <div key={index} className={`evolution-entry ${entry.type}`}>
                      <span className="evolution-text">
                        {entry.from} → {entry.to}
                      </span>
                      <span className="evolution-type">{entry.type}</span>
                      <span className="evolution-time">{entry.timestamp}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
