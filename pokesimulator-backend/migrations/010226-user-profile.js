export const up = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS user_profiles (
            id BIGSERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            display_name VARCHAR(100) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `)

    await client.query(`
        CREATE OR REPLACE FUNCTION set_user_profiles_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
    `)

    await client.query(`
        DROP TRIGGER IF EXISTS trg_user_profiles_set_updated_at ON user_profiles;
        CREATE TRIGGER trg_user_profiles_set_updated_at
        BEFORE UPDATE ON user_profiles
        FOR EACH ROW
        EXECUTE FUNCTION set_user_profiles_updated_at()
    `)
}

export const down = async (client) => {
    await client.query(`
        DROP TRIGGER IF EXISTS trg_user_profiles_set_updated_at ON user_profiles;
        DROP FUNCTION IF EXISTS set_user_profiles_updated_at;
        DROP TABLE IF EXISTS user_profiles
    `)
}
