// netlify/functions/db.js
const { neon } = require('@neondatabase/serverless');

// Initialize database connection
const sql = neon(process.env.DATABASE_URL);

module.exports = { sql };
// netlify/functions/db.js
/*import { neon } from '@neondatabase/serverless';

// Initialize database connection
export const sql = neon(process.env.DATABASE_URL);*/
// netlify/functions/db.js
/*import { neon } from '@netlify/neon';
const sql = neon(); // automatically uses env NETLIFY_DATABASE_URL
const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;*/
/*import { neon } from '@neondatabase/serverless';

// Initialize database connection
export const sql = neon(process.env.NETLIFY_DATABASE_URL);

// Helper to check if user is admin
export function isAdmin(context) {
    const user = context.clientContext?.user;
    if (!user) return false;
    
    const roles = user.app_metadata?.roles || [];
    return roles.includes('admin');
}*/