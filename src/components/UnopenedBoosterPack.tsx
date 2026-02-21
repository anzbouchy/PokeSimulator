const PRISMATIC_PACK_IMAGE_URL = '/2_276528_e.webp'
const JOURNEY_PACK_IMAGE_URL = '/2_284400_e.webp'
const DESTINED_PACK_IMAGE_URL = '/71z+NtTb8dL._AC_SL1500_.jpg'

type UnopenedBoosterPackProps = {
    selectedSetId: string
    selectedSetName: string
    onOpen: () => void
}

function UnopenedBoosterPack({ selectedSetId, selectedSetName, onOpen }: UnopenedBoosterPackProps) {
    return (
        <div className="unopened-pack">
            <div className="pack-wrapper">
                <div className="booster-pack" onClick={onOpen}>
                    {selectedSetId === 'sv08.5' ? (
                        <img
                            src={PRISMATIC_PACK_IMAGE_URL}
                            alt="Prismatic Evolutions Booster Pack"
                            className="prismatic-pack-image"
                        />
                    ) : selectedSetId === 'sv09' ? (
                        <img
                            src={JOURNEY_PACK_IMAGE_URL}
                            alt="Journey Together Booster Pack"
                            className="journey-pack-image"
                        />
                    ) : selectedSetId === 'sv10' ? (
                        <img
                            src={DESTINED_PACK_IMAGE_URL}
                            alt="Destined Rivals Booster Pack"
                            className="destined-pack-image"
                        />
                    ) : (
                        <div className="pack-art">
                            <div className="set-logo">
                                <h3>{selectedSetName}</h3>
                                <div className="pack-shine"></div>
                            </div>
                            <div className="pack-details">
                                <span className="click-hint">✨ Click to Open ✨</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UnopenedBoosterPack
