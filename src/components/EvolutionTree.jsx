import { useState, useEffect } from 'react'
import prismaticData from '../data/prismaticData'

const EvolutionTree = ({ pokemon, onEvolution, prismaticEnergy }) => {
  const [evolutionChain, setEvolutionChain] = useState([])
  
  useEffect(() => {
    // Build evolution chain starting from base form
    const chain = []
    let current = pokemon
    
    // Go back to find base form
    const findBasePokemon = (poke) => {
      const prevEvolution = prismaticData.evolutions.find(e => e.to === poke.id)
      if (prevEvolution) {
        const prevPokemon = prismaticData.pokemon.find(p => p.id === prevEvolution.from)
        return findBasePokemon(prevPokemon)
      }
      return poke
    }
    
    const basePokemon = findBasePokemon(current)
    chain.push(basePokemon)
    
    // Build forward chain
    const buildChain = (poke) => {
      const evolutions = prismaticData.evolutions.filter(e => e.from === poke.id)
      evolutions.forEach(evolution => {
        const evolved = prismaticData.pokemon.find(p => p.id === evolution.to)
        if (evolved && !chain.find(c => c.id === evolved.id)) {
          chain.push({ ...evolved, evolutionType: evolution.type, evolutionCost: evolution.prismaticCost || 20 })
          buildChain(evolved)
        }
      })
    }
    
    buildChain(basePokemon)
    
    // Update state after building the chain
    queueMicrotask(() => {
      setEvolutionChain(chain)
    })
  }, [pokemon])
  
  const handleEvolution = (targetPokemon, evolutionType) => {
    onEvolution(pokemon, evolutionType)
  }
  
  const canEvolve = (cost) => {
    return prismaticEnergy >= cost
  }

  return (
    <div className="evolution-tree">
      <h3>Evolution Tree for {pokemon.name}</h3>
      <div className="evolution-chain">
        {evolutionChain.map((poke, index) => {
          const isCurrentPokemon = poke.id === pokemon.id
          const canEvolveToThis = poke.evolutionType && canEvolve(poke.evolutionCost)
          
          return (
            <div key={poke.id} className="evolution-step">
              {index > 0 && (
                <div className="evolution-arrow">
                  <div className={`arrow ${evolutionChain[index]?.evolutionType || 'normal'}`}>
                    ⇨
                  </div>
                  <div className="evolution-requirements">
                    <span className="evolution-type-label">
                      {evolutionChain[index]?.evolutionType || 'normal'}
                    </span>
                    <span className="evolution-cost-label">
                      {evolutionChain[index]?.evolutionCost || 20}⚡
                    </span>
                  </div>
                </div>
              )}
              
              <div className={`evolution-pokemon ${isCurrentPokemon ? 'current' : ''} ${poke.isPrismatic ? 'prismatic' : ''}`}>
                <div className="evolution-sprite" style={{ 
                  backgroundColor: poke.color,
                  backgroundImage: poke.isPrismatic 
                    ? `linear-gradient(45deg, ${poke.color}, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffc107)`
                    : `linear-gradient(45deg, ${poke.color}, ${poke.secondaryColor || poke.color})`
                }}>
                  <span className="pokemon-emoji">{poke.emoji}</span>
                  {poke.isPrismatic && (
                    <div className="prismatic-aura"></div>
                  )}
                </div>
                
                <h4 className="evolution-name">{poke.name}</h4>
                <div className="evolution-types">
                  {poke.types.map((type, typeIndex) => (
                    <span key={typeIndex} className={`type-badge small ${type.toLowerCase()}`}>
                      {type}
                    </span>
                  ))}\n                </div>
                
                {isCurrentPokemon && poke.evolutionType && (
                  <button
                    className={`evolve-action ${poke.evolutionType} ${
                      canEvolveToThis ? '' : 'disabled'
                    }`}
                    onClick={() => handleEvolution(poke, poke.evolutionType)}
                    disabled={!canEvolveToThis}
                  >
                    {canEvolveToThis ? `Evolve (${poke.evolutionCost}⚡)` : 'Need More Energy'}\n                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="prismatic-evolution-info">
        <h4>🌈 Prismatic Evolution Effects</h4>
        <div className="prismatic-benefits">
          <div className="benefit">
            <span className="benefit-icon">💎</span>
            <span>+50% to all stats</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🌟</span>
            <span>Unique prismatic glow</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">⚡</span>
            <span>Special abilities unlocked</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🔮</span>
            <span>Rare collector's variant</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EvolutionTree