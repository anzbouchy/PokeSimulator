import type { ChangeEventHandler } from 'react'

type SetOption = {
    label: string
    value: string
}

type AppHeaderProps = {
    setOptions: readonly SetOption[]
    selectedSetId: string
    cardsOpenedCount: number
    onSetChange: ChangeEventHandler<HTMLSelectElement>
    onResetSession: () => void
}

function AppHeader({
    setOptions,
    selectedSetId,
    cardsOpenedCount,
    onSetChange,
    onResetSession
}: AppHeaderProps) {
    return (
        <header className="app-header">
            <h1 className="title"> Poke Simulator</h1>
            <div className="set-info">
                <label className="set-name" htmlFor="set-select">
                    Set
                </label>
                <select
                    id="set-select"
                    className="set-select"
                    value={selectedSetId}
                    onChange={onSetChange}
                >
                    {setOptions.map((setOption) => (
                        <option key={setOption.value} value={setOption.value}>
                            {setOption.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="card-counter">
                <span>Cards Opened: {cardsOpenedCount}/10</span>
                {cardsOpenedCount > 0 && (
                    <button className="reset-btn" onClick={onResetSession}>
                        🔄
                    </button>
                )}
            </div>
        </header>
    )
}

export default AppHeader
