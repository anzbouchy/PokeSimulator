import './PackEconomics.css'

type PackEconomicsProps = {
    packCost: number
    revealedValue: number
    cardsRevealed: number
    totalCards?: number
    currencySymbol?: string
}

const formatAmount = (amount: number): string => amount.toFixed(2)

function PackEconomics({
    packCost,
    revealedValue,
    cardsRevealed,
    totalCards = 10,
    currencySymbol = '$'
}: PackEconomicsProps) {
    const valueDelta = revealedValue - packCost

    return (
        <section className="pack-value-block">
            <h3>Pack Economics</h3>
            <div className="pack-value-grid">
                <div className="pack-value-item">
                    <span className="pack-value-label">Pack Cost</span>
                    <span className="pack-value-number">{currencySymbol}{formatAmount(packCost)}</span>
                </div>
                <div className="pack-value-item">
                    <span className="pack-value-label">Card Value</span>
                    <span className="pack-value-number">{currencySymbol}{formatAmount(revealedValue)}</span>
                </div>
                <div className={`pack-value-item ${valueDelta >= 0 ? 'positive' : 'negative'}`}>
                    <span className="pack-value-label">Profit / Loss</span>
                    <span className="pack-value-number">
                        {valueDelta >= 0 ? '+' : ''}
                        {currencySymbol}{formatAmount(valueDelta)}
                    </span>
                </div>
            </div>
            <p className="pack-value-progress">{cardsRevealed}/{totalCards} cards revealed</p>
        </section>
    )
}

export default PackEconomics
