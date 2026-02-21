import CurrentRevealedCard from './CurrentRevealedCard'
import OpenedCardsStack from './OpenedCardsStack'
import UnopenedBoosterPack from './UnopenedBoosterPack'

type BoosterCard = {
    id: string
    image?: string
    rarity?: string
    pullId?: string
}

type BoosterPackViewProps = {
    cardsOpenedCount: number
    isPackComplete: boolean
    openedCards: BoosterCard[]
    selectedSetId: string
    selectedSetName: string
    currentCard?: BoosterCard
    onOpenBoosterPack: () => void
    onResetSession: () => void
}

function BoosterPackView({
    cardsOpenedCount,
    isPackComplete,
    openedCards,
    selectedSetId,
    selectedSetName,
    currentCard,
    onOpenBoosterPack,
    onResetSession
}: BoosterPackViewProps) {
    return (
        <section className="pack-opening-section">
            <div className="booster-pack-container">
                {cardsOpenedCount === 0 ? (
                    <UnopenedBoosterPack
                        selectedSetId={selectedSetId}
                        selectedSetName={selectedSetName}
                        onOpen={onOpenBoosterPack}
                    />
                ) : isPackComplete ? (
                    <OpenedCardsStack
                        cards={openedCards}
                        setName={selectedSetName}
                        onStartOver={onResetSession}
                    />
                ) : (
                    <div className="opened-pack">
                        <div className="pack-results">
                            <div className="single-card-container">
                                <CurrentRevealedCard card={currentCard} onRevealNext={onOpenBoosterPack} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default BoosterPackView
