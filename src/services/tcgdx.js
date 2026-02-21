// TCGdx-like API service for Pokemon cards
class TCGdxService {
  constructor() {
    this.baseUrl = 'https://api.pokemontcg.io/v2'
    this.apiKey = '' // Optional: Add your API key here
  }

  async fetchCards(setId) {
    try {
      const response = await fetch(`${this.baseUrl}/cards?q=set.id:${setId}`, {
        headers: {
          'X-Api-Key': this.apiKey
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching cards:', error)
      return this.getFallbackCards(setId)
    }
  }

  async fetchSet(setId) {
    try {
      const response = await fetch(`${this.baseUrl}/sets/${setId}`, {
        headers: {
          'X-Api-Key': this.apiKey
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching set:', error)
      return this.getFallbackSet(setId)
    }
  }

  // Fallback data for Prismatic Evolutions
  getFallbackCards(setId) {
    const prismaticCards = [
      {
        id: 'sv4pt5-1',
        name: 'Caterpie',
        supertype: 'Pokémon',
        subtypes: ['Basic'],
        hp: '50',
        types: ['Grass'],
        attacks: [
          {
            name: 'Tackle',
            cost: ['Colorless'],
            convertedEnergyCost: 1,
            damage: '10'
          }
        ],
        weaknesses: [{ type: 'Fire', value: '×2' }],
        retreatCost: ['Colorless'],
        convertedRetreatCost: 1,
        number: '1',
        artist: 'Kouki Saitou',
        rarity: 'Common',
        flavorText: 'Its feet have suction pads that enable it to walk on steep surfaces.',
        nationalPokedexNumbers: [10],
        images: {
          small: '/api/placeholder/245/342',
          large: '/api/placeholder/734/1024'
        },
        tcgplayer: {
          prices: {
            normal: { market: 0.05 },
            holofoil: { market: 0.15 }
          }
        },
        set: {
          id: setId,
          name: 'Prismatic Evolutions',
          series: 'Scarlet & Violet',
          total: 230
        }
      },
      {
        id: 'sv4pt5-25',
        name: 'Pikachu ex',
        supertype: 'Pokémon',
        subtypes: ['Basic', 'ex'],
        hp: '120',
        types: ['Lightning'],
        attacks: [
          {
            name: 'Thunder Shock',
            cost: ['Lightning'],
            convertedEnergyCost: 1,
            damage: '20'
          },
          {
            name: 'Thunderbolt',
            cost: ['Lightning', 'Lightning'],
            convertedEnergyCost: 2,
            damage: '90'
          }
        ],
        weaknesses: [{ type: 'Fighting', value: '×2' }],
        retreatCost: ['Colorless'],
        convertedRetreatCost: 1,
        number: '25',
        artist: '5ban Graphics',
        rarity: 'Ultra Rare',
        nationalPokedexNumbers: [25],
        images: {
          small: '/api/placeholder/245/342',
          large: '/api/placeholder/734/1024'
        },
        tcgplayer: {
          prices: {
            holofoil: { market: 15.99 }
          }
        },
        set: {
          id: setId,
          name: 'Prismatic Evolutions',
          series: 'Scarlet & Violet',
          total: 230
        }
      },
      {
        id: 'sv4pt5-6',
        name: 'Charizard ex',
        supertype: 'Pokémon',
        subtypes: ['Stage 2', 'ex'],
        hp: '330',
        types: ['Fire'],
        attacks: [
          {
            name: 'Burning Darkness',
            cost: ['Fire', 'Fire'],
            convertedEnergyCost: 2,
            damage: '180'
          }
        ],
        weaknesses: [{ type: 'Water', value: '×2' }],
        retreatCost: ['Colorless', 'Colorless'],
        convertedRetreatCost: 2,
        number: '6',
        artist: '5ban Graphics', 
        rarity: 'Ultra Rare',
        nationalPokedexNumbers: [6],
        images: {
          small: '/api/placeholder/245/342',
          large: '/api/placeholder/734/1024'
        },
        tcgplayer: {
          prices: {
            holofoil: { market: 25.50 }
          }
        },
        set: {
          id: setId,
          name: 'Prismatic Evolutions',
          series: 'Scarlet & Violet', 
          total: 230
        }
      },
      {
        id: 'sv4pt5-133',
        name: 'Eevee',
        supertype: 'Pokémon',
        subtypes: ['Basic'],
        hp: '50',
        types: ['Colorless'],
        attacks: [
          {
            name: 'Tackle',
            cost: ['Colorless'],
            convertedEnergyCost: 1,
            damage: '20'
          }
        ],
        weaknesses: [{ type: 'Fighting', value: '×2' }],
        retreatCost: ['Colorless'],
        convertedRetreatCost: 1,
        number: '133',
        artist: 'Akira Komayama',
        rarity: 'Common',
        nationalPokedexNumbers: [133],
        images: {
          small: '/api/placeholder/245/342',
          large: '/api/placeholder/734/1024'
        },
        tcgplayer: {
          prices: {
            normal: { market: 0.25 },
            reverseHolofoil: { market: 0.75 }
          }
        },
        set: {
          id: setId,
          name: 'Prismatic Evolutions',
          series: 'Scarlet & Violet',
          total: 230
        }
      },
      {
        id: 'sv4pt5-134',
        name: 'Vaporeon',
        supertype: 'Pokémon',
        subtypes: ['Stage 1'],
        hp: '120',
        types: ['Water'],
        attacks: [
          {
            name: 'Aurora Beam',
            cost: ['Water', 'Colorless'],
            convertedEnergyCost: 2,
            damage: '70'
          }
        ],
        weaknesses: [{ type: 'Lightning', value: '×2' }],
        retreatCost: ['Colorless', 'Colorless'],
        convertedRetreatCost: 2,
        number: '134',
        artist: 'kawayoo',
        rarity: 'Rare',
        nationalPokedexNumbers: [134],
        images: {
          small: '/api/placeholder/245/342',
          large: '/api/placeholder/734/1024'
        },
        tcgplayer: {
          prices: {
            holofoil: { market: 2.80 }
          }
        },
        set: {
          id: setId,
          name: 'Prismatic Evolutions',
          series: 'Scarlet & Violet',
          total: 230
        }
      },
      {
        id: 'sv4pt5-135',
        name: 'Jolteon',
        supertype: 'Pokémon',
        subtypes: ['Stage 1'],
        hp: '90',
        types: ['Lightning'],
        attacks: [
          {
            name: 'Pin Missile',
            cost: ['Lightning', 'Colorless'],
            convertedEnergyCost: 2,
            damage: '30×'
          }
        ],
        weaknesses: [{ type: 'Fighting', value: '×2' }],
        retreatCost: [],
        convertedRetreatCost: 0,
        number: '135',
        artist: 'Oswaldo KATO',
        rarity: 'Rare',
        nationalPokedexNumbers: [135],
        images: {
          small: '/api/placeholder/245/342',
          large: '/api/placeholder/734/1024'
        },
        tcgplayer: {
          prices: {
            holofoil: { market: 3.15 }
          }
        },
        set: {
          id: setId,
          name: 'Prismatic Evolutions',
          series: 'Scarlet & Violet',
          total: 230
        }
      },
      {
        id: 'sv4pt5-136',
        name: 'Flareon',
        supertype: 'Pokémon',
        subtypes: ['Stage 1'],
        hp: '110',
        types: ['Fire'],
        attacks: [
          {
            name: 'Searing Heat',
            cost: ['Fire', 'Colorless', 'Colorless'],
            convertedEnergyCost: 3,
            damage: '100'
          }
        ],
        weaknesses: [{ type: 'Water', value: '×2' }],
        retreatCost: ['Colorless', 'Colorless'],
        convertedRetreatCost: 2,
        number: '136',
        artist: 'Kouki Saitou',
        rarity: 'Rare',
        nationalPokedexNumbers: [136],
        images: {
          small: '/api/placeholder/245/342',
          large: '/api/placeholder/734/1024'
        },
        tcgplayer: {
          prices: {
            holofoil: { market: 2.95 }
          }
        },
        set: {
          id: setId,
          name: 'Prismatic Evolutions',
          series: 'Scarlet & Violet',
          total: 230
        }
      },
      {
        id: 'sv4pt5-470',
        name: 'Leafeon',
        supertype: 'Pokémon',
        subtypes: ['Stage 1'],
        hp: '110',
        types: ['Grass'],
        attacks: [
          {
            name: 'Razor Leaf',
            cost: ['Grass', 'Colorless'],
            convertedEnergyCost: 2,
            damage: '60'
          }
        ],
        weaknesses: [{ type: 'Fire', value: '×2' }],
        retreatCost: ['Colorless'],
        convertedRetreatCost: 1,
        number: '470',
        artist: '5ban Graphics',
        rarity: 'Rare',
        nationalPokedexNumbers: [470],
        images: {
          small: '/api/placeholder/245/342',
          large: '/api/placeholder/734/1024'  
        },
        tcgplayer: {
          prices: {
            holofoil: { market: 3.40 }
          }
        },
        set: {
          id: setId,
          name: 'Prismatic Evolutions',
          series: 'Scarlet & Violet',
          total: 230
        }
      },
      {
        id: 'sv4pt5-196',
        name: 'Espeon',
        supertype: 'Pokémon',
        subtypes: ['Stage 1'],
        hp: '90',
        types: ['Psychic'],
        attacks: [
          {
            name: 'Psybeam',
            cost: ['Psychic', 'Colorless'],
            convertedEnergyCost: 2,
            damage: '60'
          }
        ],
        weaknesses: [{ type: 'Darkness', value: '×2' }],
        retreatCost: ['Colorless'],
        convertedRetreatCost: 1,
        number: '196',
        artist: 'Sanosuke Sakuma',
        rarity: 'Rare',
        nationalPokedexNumbers: [196],
        images: {
          small: '/api/placeholder/245/342',
          large: '/api/placeholder/734/1024'
        },
        tcgplayer: {
          prices: {
            holofoil: { market: 4.25 }
          }
        },
        set: {
          id: setId,
          name: 'Prismatic Evolutions',
          series: 'Scarlet & Violet',
          total: 230
        }
      },
      {
        id: 'sv4pt5-197',
        name: 'Umbreon',
        supertype: 'Pokémon',
        subtypes: ['Stage 1'],
        hp: '110',
        types: ['Darkness'],
        attacks: [
          {
            name: 'Dark Pulse',
            cost: ['Darkness', 'Colorless', 'Colorless'],
            convertedEnergyCost: 3,
            damage: '80'
          }
        ],
        weaknesses: [{ type: 'Fighting', value: '×2' }],
        retreatCost: ['Colorless', 'Colorless'],
        convertedRetreatCost: 2,
        number: '197',
        artist: 'Akira Komayama',
        rarity: 'Rare',
        nationalPokedexNumbers: [197],
        images: {
          small: '/api/placeholder/245/342',
          large: '/api/placeholder/734/1024'
        },
        tcgplayer: {
          prices: {
            holofoil: { market: 5.80 }
          }
        },
        set: {
          id: setId,
          name: 'Prismatic Evolutions',
          series: 'Scarlet & Violet',
          total: 230
        }
      }
    ]
    
    return prismaticCards
  }

  getFallbackSet(setId) {
    return {
      id: setId,
      name: 'Prismatic Evolutions',
      series: 'Scarlet & Violet',
      printedTotal: 230,
      total: 230,
      legalities: {
        standard: 'Legal',
        expanded: 'Legal'
      },
      ptcgoCode: 'SV4PT5',
      releaseDate: '2024/01/26',
      updatedAt: '2024/01/26 13:35:00',
      images: {
        symbol: '/api/placeholder/128/128',
        logo: '/api/placeholder/256/256'
      }
    }
  }

  // Create tcgdx-like interface
  get set() {
    return {
      get: async (setId) => {
        const setData = await this.fetchSet(setId)
        const cards = await this.fetchCards(setId)
        return {
          ...setData,
          cards: cards
        }
      }
    }
  }

  get card() {
    return {
      get: async () => {
        // Implementation for getting individual card
        return null
      }
    }
  }
}

// Create singleton instance
const tcgdx = new TCGdxService()

export default tcgdx