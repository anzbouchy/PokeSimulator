const prismaticData = {
  pokemon: [
    // Prismatic Evolutions - Actual TCG Set Cards
    {
      id: 1,
      name: 'Pikachu ex',
      emoji: '⚡',
      types: ['Electric'],
      color: '#F8D030',
      secondaryColor: '#FFC107',
      stats: { hp: 120, attack: 90, defense: 50, speed: 110 },
      rarity: 'Ultra Rare',
      cardNumber: '088/131',
      price: '$15.99'
    },
    {
      id: 2,
      name: 'Charizard ex',
      emoji: '🔥',
      types: ['Fire', 'Flying'],
      color: '#F08030',
      secondaryColor: '#A890F0',
      stats: { hp: 130, attack: 120, defense: 80, speed: 100 },
      rarity: 'Ultra Rare',
      cardNumber: '054/131',
      price: '$25.50'
    },
    {
      id: 3,
      name: 'Applin',
      emoji: '🍏',
      types: ['Grass', 'Dragon'],
      color: '#78C850',
      secondaryColor: '#7038F8',
      stats: { hp: 40, attack: 40, defense: 80, speed: 20 },
      rarity: 'Common',
      cardNumber: '009/131',
      price: '$0.17'
    },
    {
      id: 4,
      name: 'Archaludon',
      emoji: '🏗️',
      types: ['Steel', 'Dragon'],
      color: '#B8B8D0',
      secondaryColor: '#7038F8',
      stats: { hp: 130, attack: 105, defense: 130, speed: 85 },
      rarity: 'Rare',
      cardNumber: '070/131',
      price: '$0.09'
    },
    {
      id: 5,
      name: 'Aromatisse',
      emoji: '💕',
      types: ['Fairy'],
      color: '#EE99AC',
      secondaryColor: '#F8D030',
      stats: { hp: 101, attack: 72, defense: 72, speed: 29 },
      rarity: 'Common',
      cardNumber: '039/131',
      price: '$0.15'
    },
    {
      id: 6,
      name: 'Eevee',
      emoji: '🦊',
      types: ['Normal'],
      color: '#A8A878',
      secondaryColor: '#C4A484',
      stats: { hp: 50, attack: 55, defense: 50, speed: 55 },
      rarity: 'Common',
      cardNumber: '101/131',
      price: '$0.25'
    },
    {
      id: 7,
      name: 'Vaporeon',
      emoji: '🌊',
      types: ['Water'],
      color: '#6890F0',
      secondaryColor: '#4ECDC4',
      stats: { hp: 130, attack: 65, defense: 60, speed: 65 },
      rarity: 'Rare',
      cardNumber: '134/131',
      price: '$2.80'
    },
    {
      id: 8,
      name: 'Jolteon',
      emoji: '⚡',
      types: ['Electric'],
      color: '#F8D030',
      secondaryColor: '#FFC107',
      stats: { hp: 65, attack: 65, defense: 60, speed: 130 },
      rarity: 'Rare',
      cardNumber: '135/131',
      price: '$3.15'
    },
    {
      id: 9,
      name: 'Flareon',
      emoji: '🔥',
      types: ['Fire'],
      color: '#F08030',
      secondaryColor: '#FF6B6B',
      stats: { hp: 65, attack: 130, defense: 60, speed: 65 },
      rarity: 'Rare',
      cardNumber: '136/131',
      price: '$2.95'
    },
    {
      id: 10,
      name: 'Leafeon',
      emoji: '🍃',
      types: ['Grass'],
      color: '#78C850',
      secondaryColor: '#A8E6A3',
      stats: { hp: 65, attack: 110, defense: 130, speed: 95 },
      rarity: 'Rare',
      cardNumber: '470/131',
      price: '$3.40'
    },
    
    // Master Ball Pattern Variants
    {
      id: 103,
      name: 'Applin (Master Ball)',
      emoji: '🍏✨',
      types: ['Grass', 'Dragon'],
      color: '#78C850',
      secondaryColor: '#FFD700',
      stats: { hp: 60, attack: 60, defense: 120, speed: 30 },
      rarity: 'Master Ball Pattern',
      cardNumber: '009/131',
      price: '$2.15',
      isPrismatic: true,
      pattern: 'masterball'
    },
    {
      id: 104,
      name: 'Archaludon (Master Ball)',
      emoji: '🏗️✨',
      types: ['Steel', 'Dragon'],
      color: '#B8B8D0',
      secondaryColor: '#FFD700',
      stats: { hp: 195, attack: 158, defense: 195, speed: 128 },
      rarity: 'Master Ball Pattern',
      cardNumber: '070/131',
      price: '$3.84',
      isPrismatic: true,
      pattern: 'masterball'
    },
    {
      id: 105,
      name: 'Aromatisse (Master Ball)',
      emoji: '💕✨',
      types: ['Fairy'],
      color: '#EE99AC',
      secondaryColor: '#FFD700',
      stats: { hp: 152, attack: 108, defense: 108, speed: 44 },
      rarity: 'Master Ball Pattern',
      cardNumber: '039/131',
      price: '$5.36',
      isPrismatic: true,
      pattern: 'masterball'
    },
    
    // Special Illustration Rare
    {
      id: 200,
      name: 'Amarys (Special Art)',
      emoji: '👩‍💼🌟',
      types: ['Trainer'],
      color: '#4A90E2',
      secondaryColor: '#FFD700',
      stats: { hp: 0, attack: 0, defense: 0, speed: 0 },
      rarity: 'Special Illustration Rare',
      cardNumber: '170/131',
      price: '$14.51',
      isPrismatic: true,
      pattern: 'specialart'
    }
  ],
  
  evolutions: [
    // Standard evolutions from Eevee
    { from: 6, to: 7, type: 'water stone', prismaticCost: 25 },
    { from: 6, to: 8, type: 'thunder stone', prismaticCost: 25 },
    { from: 6, to: 9, type: 'fire stone', prismaticCost: 25 },
    { from: 6, to: 10, type: 'leaf stone', prismaticCost: 25 },
    
    // Master Ball Pattern evolutions (special upgrade)
    { from: 3, to: 103, type: 'master ball pattern', prismaticCost: 50 },
    { from: 4, to: 104, type: 'master ball pattern', prismaticCost: 50 },
    { from: 5, to: 105, type: 'master ball pattern', prismaticCost: 50 }
  ],
  
  // TCG Set Information
  setInfo: {
    name: 'SV: Prismatic Evolutions',
    totalCards: 131,
    secretRares: 25,
    patterns: ['Standard', 'Reverse Holo', 'Poke Ball Pattern', 'Master Ball Pattern'],
    rarities: ['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Special Illustration Rare']
  }
}

export default prismaticData