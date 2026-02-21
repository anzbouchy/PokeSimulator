import type { CSSProperties } from 'react'
import './OpenedCardsStack.css'

type StackCard = {
    id: string
    image?: string
    rarity?: string
    pullId?: string
}

type OpenedCardsStackProps = {
    cards: StackCard[]
    setName: string
    onStartOver: () => void
}

function OpenedCardsStack({ cards, setName, onStartOver }: OpenedCardsStackProps) {
    const cardsToRender = cards.slice(-10)

    return (
        <div className="opened-cards-stack">
            <div className="opened-cards-stack-header">
                <h2>{setName} Complete</h2>
                <p>Your full pack stack is ready.</p>
            </div>

            <div className="opened-cards-stack-stage" role="list" aria-label="Opened cards stack">
                {cardsToRender.map((card, index) => {
                    const isTopCard = index === cardsToRender.length - 1
                    return (
                        <div
                            key={card.pullId ?? `${card.id}-${index}`}
                            role="listitem"
                            className={`opened-cards-stack-item${isTopCard ? ' top-card' : ''}`}
                            style={
                                {
                                    '--stack-index': index,
                                    '--stack-size': cardsToRender.length,
                                    zIndex: isTopCard ? cardsToRender.length + 10 : index + 1
                                } as CSSProperties
                            }
                        >
                            {card.image ? (
                                <img
                                    src={card.image}
                                    alt={card.id || 'Card'}
                                    className="opened-cards-stack-image"
                                />
                            ) : (
                                <div className="opened-cards-stack-placeholder">{card.id || 'Card'}</div>
                            )}
                        </div>
                    )
                })}
            </div>

            <button className="opened-cards-stack-reset" onClick={onStartOver}>
                🔄 Start New Pack
            </button>
        </div>
    )
}

export default OpenedCardsStack
