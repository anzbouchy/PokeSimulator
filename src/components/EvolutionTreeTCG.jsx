const EvolutionTree = ({ pokemon, onEvolution, prismaticEnergy }) => {
  // Derive evolution options directly from pokemon data
  const getEvolutionOptions = () => {
    const options = []
    
    if (!pokemon.isPrismatic) {
      options.push({
        name: 'Enhanced Evolution',
        type: 'enhance',
        cost: 30,
        description: 'Boost stats and add special effects',
        benefits: ['+50 HP', '+30 ATK', '+20 DEF', '+25 SPD']
      })
      
      options.push({
        name: 'Prismatic Evolution', 
        type: 'prismatic',
        cost: 50,
        description: 'Ultimate transformation with prismatic powers',
        benefits: ['+100 HP', '+60 ATK', '+40 DEF', '+50 SPD', 'Prismatic Glow']
      })
    } else {
      options.push({
        name: 'Already Evolved',
        type: 'maxed',
        cost: 0,
        description: 'This Pokemon has reached its ultimate form!',
        benefits: ['Maximum Power Achieved']
      })
    }
    
    return options
  }
  
  const evolutionOptions = getEvolutionOptions()
  
  const handleEvolution = (evolutionType) => {
    onEvolution(pokemon, evolutionType)
  }
  
  const canEvolve = (cost) => {
    return prismaticEnergy >= cost && cost > 0
  }

  return (
    <div className="evolution-tree">
      <h3>Evolution Options for {pokemon.name}</h3>
      
      <div className="current-pokemon-display">
        <div className={`pokemon-showcase ${pokemon.isPrismatic ? 'prismatic' : ''}`}>
          <div className="showcase-sprite" style={{ 
            backgroundColor: pokemon.color,
            backgroundImage: pokemon.isPrismatic 
              ? `linear-gradient(45deg, ${pokemon.color}, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffc107)`
              : `linear-gradient(45deg, ${pokemon.color}, ${pokemon.secondaryColor || pokemon.color})`
          }}>
            <span className="showcase-emoji">{pokemon.emoji}</span>
            {pokemon.isPrismatic && (
              <div className="showcase-aura"></div>
            )}
          </div>
          
          <div className="showcase-info">
            <h4>{pokemon.name}</h4>
            <div className="showcase-types">
              {pokemon.types.map((type, index) => (
                <span key={index} className={`type-badge ${type.toLowerCase()}`}>
                  {type}
                </span>
              ))}
            </div>
            <div className="showcase-stats">
              <div className="stat-display">
                <span>HP: {pokemon.stats.hp}</span>
                <span>ATK: {pokemon.stats.attack}</span>
              </div>
              <div className="stat-display">
                <span>DEF: {pokemon.stats.defense}</span>
                <span>SPD: {pokemon.stats.speed}</span>
              </div>
            </div>
            {pokemon.rarity && (
              <div className="showcase-rarity">
                <span className={`rarity-badge ${pokemon.rarity.toLowerCase().replace(/\\s+/g, '-')}`}>
                  {pokemon.rarity}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="evolution-options-grid">
        {evolutionOptions.map((option, index) => (
          <div key={index} className={`evolution-option-card ${option.type}`}>
            <h4 className="option-name">{option.name}</h4>
            <p className="option-description">{option.description}</p>
            
            <div className="option-benefits">
              <h5>Benefits:</h5>
              <ul>
                {option.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex}>{benefit}</li>
                ))}
              </ul>
            </div>
            
            <div className="option-cost">
              <span className="cost-label">Energy Cost:</span>
              <span className="cost-value">{option.cost}⚡</span>
            </div>
            
            {option.cost > 0 && (
              <button
                className={`evolution-action-btn ${option.type} ${
                  canEvolve(option.cost) ? '' : 'disabled'
                }`}
                onClick={() => handleEvolution(option.type)}
                disabled={!canEvolve(option.cost)}
              >
                {canEvolve(option.cost) ? 
                  `Evolve (${option.cost}⚡)` : 
                  `Need ${option.cost - prismaticEnergy} more energy`}
              </button>
            )}
            
            {option.type === 'maxed' && (
              <div className="maxed-indicator">
                <span>🌟 Perfect Form 🌟</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="tcg-evolution-info">
        <h4>🎴 TCG Evolution System</h4>
        <div className="tcg-benefits">
          <div className="benefit">
            <span className="benefit-icon">📈</span>
            <span>Stat Boosts</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">✨</span>
            <span>Visual Effects</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">💎</span>
            <span>Increased Value</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🎨</span>
            <span>Special Patterns</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EvolutionTree