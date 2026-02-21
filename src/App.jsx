import { useState, useEffect } from 'react'
import './App.css'
import PokemonCard from './components/PokemonCard'
import EvolutionTree from './components/EvolutionTreeTCG'
import tcgdx from './services/tcgdx'

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
      const damage = parseInt(attack.damage.replace(/[^0-9]/g, '')) || 0
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
  const [availableCards, setAvailableCards] = useState([])
  const [openedCards, setOpenedCards] = useState([])
  const [cardsOpenedCount, setCardsOpenedCount] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    async function loadPrismaticEvolutions() {
      try {
        setLoading(true)
        // Fetch Prismatic Evolutions set (sv4pt5 is the set code)
        const set = await tcgdx.set.get('sv4pt5')
        
        setSetInfo(set)
        
        // Transform TCG API data to our format
        const transformedCards = set.cards.map(card => ({
          id: card.id,
          name: card.name,
          emoji: getEmojiForPokemon(card.name),
          types: card.types || ['Colorless'],
          color: getColorForType(card.types?.[0] || 'Colorless'),
          secondaryColor: getSecondaryColor(card.types?.[0] || 'Colorless'),
          stats: {
            hp: parseInt(card.hp) || 0,
            attack: getAttackPower(card.attacks),
            defense: 50, // Default since TCG doesn't have defense
            speed: getSpeedFromRetreat(card.convertedRetreatCost)
          },
          rarity: card.rarity,
          cardNumber: card.number,
          price: card.tcgplayer?.prices?.holofoil?.market ? 
                 `$${card.tcgplayer.prices.holofoil.market.toFixed(2)}` :
                 card.tcgplayer?.prices?.normal?.market ? 
                 `$${card.tcgplayer.prices.normal.market.toFixed(2)}` : 
                 'N/A',
          isPrismatic: card.rarity?.includes('Ultra') || card.rarity?.includes('Secret'),
          pattern: card.rarity?.includes('Ultra') ? 'ultra' : 
                  card.rarity?.includes('Secret') ? 'secret' : null,
          artist: card.artist,
          setName: card.set?.name,
          flavorText: card.flavorText || 'A mysterious Pokemon card with incredible power.'
        }))
        
        // Store all available cards
        setAvailableCards(transformedCards)
        
        // Start with no card shown (pack not opened)
        setPackOpened(false)
      } catch (error) {
        console.error('Error loading cards:', error)
        // Fallback to default collection if API fails
        setAvailableCards([])
      } finally {
        setLoading(false)
      }
    }

    loadPrismaticEvolutions()
  }, [])

  const openBoosterPack = () => {
    if (availableCards.length === 0) return
    
    // If we already have 10 cards, don't open more
    if (cardsOpenedCount >= 10) return
    
    // Generate just 1 card for simple pack opening
    const packStructure = ['Common']
    
    // Chance for rare pulls
    if (Math.random() < 0.7) { // 70% chance for rare
      packStructure[0] = 'Rare'
    }
    
    if (Math.random() < 0.15) { // 15% chance for ultra rare
      packStructure[0] = 'Ultra Rare'
    }
    
    if (Math.random() < 0.03) { // 3% chance for secret rare
      packStructure[0] = 'Secret Rare'
    }
    
    // Find cards of target rarity
    const targetRarity = packStructure[0]
    const cardsOfRarity = availableCards.filter(card => {
      if (targetRarity === 'Ultra Rare') {
        return card.rarity?.includes('Ultra') || card.rarity?.includes('Rare Holo')
      }
      if (targetRarity === 'Secret Rare') {
        return card.rarity?.includes('Secret')
      }
      return card.rarity === targetRarity || 
             (targetRarity === 'Common' && !card.rarity) ||
             (targetRarity === 'Rare' && card.rarity?.includes('Rare') && !card.rarity?.includes('Ultra'))
    })
    
    // Select random card from rarity pool, fallback to any card
    const selectedCard = cardsOfRarity.length > 0 
      ? cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)]
      : availableCards[Math.floor(Math.random() * availableCards.length)]
    
    // Add unique identifier
    const pulledCard = {
      ...selectedCard,
      pullId: `${selectedCard.id}-${Date.now()}-${Math.random()}`
    }
    
    // Add to opened cards collection
    const newOpenedCards = [...openedCards, pulledCard]
    setOpenedCards(newOpenedCards)
    
    // Increment count
    const newCount = cardsOpenedCount + 1
    setCardsOpenedCount(newCount)
    
    // Show summary after 10 cards, otherwise show individual card
    if (newCount >= 10) {
      setShowSummary(true)
      setRevealedCards([])
      setSelectedPokemon(null)
    } else {
      setRevealedCards([pulledCard]) // Show individual card for cards 1-9
      setSelectedPokemon(pulledCard)
    }
    
    setPackOpened(true)
    
    // Pack opening excitement based on rarity
    if (pulledCard.rarity?.includes('Ultra') || pulledCard.rarity?.includes('Secret')) {
      setPrismaticEnergy(prev => Math.min(100, prev + 5))
    }
  }
  
  const openNewPack = () => {
    if (showSummary) return // Don't open new packs when showing summary
    
    setSelectedPokemon(null)
    setRevealedCards([])
    setPackOpened(false)
    // Reset energy for new pack
    setPrismaticEnergy(prev => Math.max(50, prev - 10))
    
    // Automatically open the next pack
    setTimeout(() => {
      openBoosterPack()
    }, 100)
  }

  const resetSession = () => {
    setSelectedPokemon(null)
    setRevealedCards([])
    setPackOpened(false)
    setOpenedCards([])
    setCardsOpenedCount(0)
    setShowSummary(false)
    setPrismaticEnergy(100)
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
        <h1 className="title">🌈 Pokemon Prismatic Evolutions</h1>
        {setInfo && (
          <div className="set-info">
            <span className="set-name">{setInfo.name}</span>
            <span className="set-series">{setInfo.series}</span>
            <span className="set-total">{setInfo.total} cards</span>
          </div>
        )}
        <div className="energy-bar">
          <span>Prismatic Energy: </span>
          <div className="energy-container">
            <div 
              className="energy-fill" 
              style={{ width: `${prismaticEnergy}%` }}
            ></div>
            <span className="energy-text">{prismaticEnergy}/100</span>
          </div>
        </div>
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
                          {/* Show the revealed Pokemon card directly - clickable to open new pack */}
                          {revealedCards.length > 0 && (
                            <div className="revealed-pokemon-card">
                              <div className="clickable-pokemon-card" onClick={cardsOpenedCount < 10 ? openNewPack : undefined}>
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
