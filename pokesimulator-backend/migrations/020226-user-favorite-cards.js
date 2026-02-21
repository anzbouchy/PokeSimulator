export const up = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS user_favorite_cards (
            id BIGSERIAL PRIMARY KEY,
            user_profile_id BIGINT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
            card_id VARCHAR(100) NOT NULL,
            image TEXT NOT NULL,
            rarity VARCHAR(100) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE (user_profile_id, card_id)
        )
    `)

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_user_favorite_cards_user_profile_id
        ON user_favorite_cards (user_profile_id)
    `)
}

export const down = async (client) => {
    await client.query(`
        DROP INDEX IF EXISTS idx_user_favorite_cards_user_profile_id;
        DROP TABLE IF EXISTS user_favorite_cards
    `)
}
