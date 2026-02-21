type RevealedCard = {
    id: string
    image?: string
    rarity?: string
}

type CurrentRevealedCardProps = {
    card?: RevealedCard
    onRevealNext: () => void
}

function CurrentRevealedCard({ card, onRevealNext }: CurrentRevealedCardProps) {
    if (!card?.image) {
        return null
    }

    const rarityLower = typeof card.rarity === 'string' ? card.rarity.toLowerCase() : ''
    const isSpecialOrHyperRare = Boolean(
        rarityLower &&
        (rarityLower.includes('special illustration rare') || rarityLower.includes('hyper rare'))
    )
    const isAceSpecRare = Boolean(rarityLower && rarityLower.includes('ace spec'))
    const rarityClass = isSpecialOrHyperRare
        ? ' fire-spark-card'
        : isAceSpecRare
            ? ' ace-spec-card'
            : ''

    return (
        <div className="revealed-pokemon-card">
            <div className={`clickable-pokemon-card${rarityClass}`} onClick={onRevealNext}>
                <img src={card.image} alt={card.id || 'Card'} className="pokemon-art" />
            </div>
        </div>
    )
}

export default CurrentRevealedCard
