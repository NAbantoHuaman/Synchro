import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// --- CONFIGURATION ---
const DB_FILE = path.join(__dirname, '../../data/users.json');
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL;

// PostgreSQL Pool (only if DATABASE_URL is present)
const pool = process.env.DATABASE_URL ? new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
}) : null;

// --- INITIALIZATION ---
const initDB = async () => {
    if (pool) {
        console.log('Using PostgreSQL (Supabase)');
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    name TEXT,
                    email TEXT UNIQUE,
                    password TEXT,
                    avatar TEXT,
                    created_at BIGINT
                );
                CREATE TABLE IF NOT EXISTS playlists (
                    id TEXT PRIMARY KEY,
                    user_id TEXT,
                    name TEXT,
                    songs JSONB,
                    created_at BIGINT
                );
                CREATE TABLE IF NOT EXISTS favorites (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT,
                    track_id TEXT,
                    track_data JSONB,
                    created_at BIGINT,
                    UNIQUE(user_id, track_id)
                );
                CREATE TABLE IF NOT EXISTS history (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT,
                    track_id TEXT,
                    track_data JSONB,
                    played_at BIGINT
                );
                CREATE TABLE IF NOT EXISTS follows (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT,
                    artist_id TEXT,
                    artist_data JSONB,
                    followed_at BIGINT,
                    UNIQUE(user_id, artist_id)
                );
                CREATE TABLE IF NOT EXISTS search_history (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT,
                    query TEXT,
                    searched_at BIGINT
                );
            `);
        } catch (err) {
            console.error('Error initializing PostgreSQL:', err);
        }
    } else {
        console.log('Using local JSON database');
        const dataDir = path.dirname(DB_FILE);
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], playlists: [] }, null, 2));
    }
};

initDB();

// --- USER METHODS ---
export const getUsers = async () => {
    if (pool) {
        const res = await pool.query('SELECT * FROM users');
        return res.rows;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data).users;
};

export const saveUser = async (user: any) => {
    if (pool) {
        await pool.query(
            'INSERT INTO users (id, name, email, password, avatar, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
            [user.id, user.name, user.email, user.password, user.avatar, user.createdAt]
        );
    } else {
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        data.users.push(user);
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    }
};
export const findUserByEmail = async (email: string) => {
    if (pool) {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rows[0];
    }
    const users = await getUsers();
    return users.find((u: any) => u.email === email);
};

export const updateUser = async (userId: string, updates: any) => {
    if (pool) {
        const fields = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
        await pool.query(
            `UPDATE users SET ${setClause} WHERE id = $1`,
            [userId, ...values]
        );
    } else {
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        const index = data.users.findIndex((u: any) => u.id === userId);
        if (index !== -1) {
            data.users[index] = { ...data.users[index], ...updates };
            fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        }
    }
};

// --- PLAYLIST METHODS ---
export const getPlaylistsByUserId = async (userId: string) => {
    if (pool) {
        const res = await pool.query('SELECT * FROM playlists WHERE user_id = $1', [userId]);
        return res.rows;
    }
    // Local JSON logic for playlists (if needed)
    return [];
};
