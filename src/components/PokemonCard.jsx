import { useState } from 'react'

const PokemonCard = ({ pokemon, onClick, isSelected, onEvolution, prismaticEnergy, isRevealed }) => {
  const [showEvolutions, setShowEvolutions] = useState(false)
  
  // For TCG cards, we'll create simple evolution options
  const availableEvolutions = pokemon?.isPrismatic ? [] : [
    { type: 'enhance', prismaticCost: 30 },
    { type: 'prismatic', prismaticCost: 50 }
  ]
  
  const handleEvolutionClick = (evolutionType, e) => {
    e.stopPropagation()
    onEvolution(pokemon, evolutionType)
    setShowEvolutions(false)
  }
  
  const canEvolve = (evolution) => {
    const cost = evolution.prismaticCost || 30
    return prismaticEnergy >= cost
  }

  return (
    <div className={`pokemon-card ${isSelected ? 'selected' : ''} ${pokemon.isPrismatic ? 'prismatic' : ''} ${isRevealed ? 'revealed' : ''}`}>
      <div className="card-inner" onClick={onClick}>
        <div className="pokemon-image">
          <div className="pokemon-sprite" style={{ 
            backgroundColor: pokemon.color,
            backgroundImage: `linear-gradient(45deg, ${pokemon.color}, ${pokemon.secondaryColor || pokemon.color})`
          }}>
            <span className="pokemon-emoji">{pokemon.emoji}</span>
            {pokemon.isPrismatic && (
              <div className="prismatic-glow"></div>
            )}
          </div>
        </div>
        
        <div className="pokemon-info">
          <h3 className="pokemon-name">{pokemon.name}</h3>
          <div className="card-details">
            <span className="card-number">#{pokemon.cardNumber}</span>
            <span className={`rarity-badge ${pokemon.rarity?.toLowerCase().replace(/\s+/g, '-')}`}>
              {pokemon.rarity}
            </span>
          </div>
          <div className="pokemon-types">
            {pokemon.types.map((type, index) => (
              <span key={index} className={`type-badge ${type.toLowerCase()}`}>
                {type}
              </span>
            ))}
          </div>
          {pokemon.price && pokemon.price !== 'N/A' && (
            <div className="card-price">
              <span className="price-label">Market Price:</span>
              <span className="price-value">{pokemon.price}</span>
            </div>
          )}
          {pokemon.pattern && (
            <div className="pattern-info">
              <span className={`pattern-badge ${pokemon.pattern}`}>
                {pokemon.pattern === 'ultra' ? '⭐ Ultra Rare' : 
                 pokemon.pattern === 'secret' ? '🔥 Secret Rare' :
                 pokemon.pattern === 'enhanced' ? '🌟 Enhanced' : pokemon.pattern}
              </span>
            </div>
          )}
          {pokemon.artist && (
            <div className="artist-info">
              <span className="artist-label">Artist:</span>
              <span className="artist-name">{pokemon.artist}</span>
            </div>
          )}
          <div className="pokemon-stats">
            <div className="stat">
              <span className="stat-name">HP</span>
              <div className="stat-bar">
                <div 
                  className="stat-fill hp" 
                  style={{ width: `${Math.min(100, (pokemon.stats.hp / 300) * 100)}%` }}
                ></div>
                <span className="stat-value">{pokemon.stats.hp}</span>
              </div>
            </div>
            <div className="stat">
              <span className="stat-name">ATK</span>
              <div className="stat-bar">
                <div 
                  className="stat-fill attack" 
                  style={{ width: `${Math.min(100, (pokemon.stats.attack / 200) * 100)}%` }}
                ></div>
                <span className="stat-value">{pokemon.stats.attack}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {availableEvolutions.length > 0 && !isRevealed && (
        <div className="evolution-controls">
          <button 
            className="evolve-btn"
            onClick={(e) => {
              e.stopPropagation()
              setShowEvolutions(!showEvolutions)
            }}
          >
            ⚡ Evolve
          </button>
          
          {showEvolutions && (
            <div className="evolution-options">
              {availableEvolutions.map((evolution, index) => (
                <button
                  key={index}
                  className={`evolution-option ${evolution.type} ${
                    canEvolve(evolution) ? '' : 'disabled'
                  }`}
                  onClick={(e) => handleEvolutionClick(evolution.type, e)}
                  disabled={!canEvolve(evolution)}
                  title={`Cost: ${evolution.prismaticCost || 20} energy`}
                >
                  <span className="evolution-name">{evolution.type}</span>
                  <span className="evolution-cost">{evolution.prismaticCost || 20}⚡</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PokemonCard