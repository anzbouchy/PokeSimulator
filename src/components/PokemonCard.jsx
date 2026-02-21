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
            {pokemon.image ? (
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="pokemon-art"
              />
            ) : (
              <span className="pokemon-emoji">{pokemon.emoji}</span>
            )}
            {pokemon.isPrismatic && (
              <div className="prismatic-glow"></div>
            )}
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