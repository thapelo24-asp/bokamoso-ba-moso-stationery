// setup-database.js
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
    console.log('Setting up database...');
    
    try {
        // Create products table
        console.log('Creating products table...');
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                category TEXT,
                tag TEXT,
                image_path TEXT,
                stock INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('✅ Products table created');

        // Create orders table
        console.log('Creating orders table...');
        await sql`
            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                customer_name TEXT NOT NULL,
                customer_email TEXT NOT NULL,
                customer_phone TEXT,
                customer_id_number TEXT,
                items JSONB NOT NULL,
                shipping_address TEXT NOT NULL,
                shipping_method TEXT,
                shipping_cost DECIMAL(10,2),
                subtotal DECIMAL(10,2),
                total DECIMAL(10,2) NOT NULL,
                payment_method TEXT,
                payment_status TEXT DEFAULT 'Pending',
                status TEXT DEFAULT 'pending',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('✅ Orders table created');

        // Create customers table
        console.log('Creating customers table...');
        await sql`
            CREATE TABLE IF NOT EXISTS customers (
                id SERIAL PRIMARY KEY,
                name TEXT,
                email TEXT UNIQUE,
                phone TEXT,
                id_number TEXT,
                orders_count INTEGER DEFAULT 0,
                total_spent DECIMAL(10,2) DEFAULT 0,
                source TEXT,
                joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_order TIMESTAMP
            )
        `;
        console.log('✅ Customers table created');

        // Create messages table
        console.log('Creating messages table...');
        await sql`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                subject TEXT,
                message TEXT NOT NULL,
                read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('✅ Messages table created');

        // Insert sample products
        console.log('Inserting sample products...');
        const sampleProducts = [
            {
                name: 'Premium Leather Journal',
                description: 'Handcrafted leather journal with premium paper and ribbon bookmark.',
                price: 899.99,
                category: 'journals',
                tag: 'Bestseller',
                image_path: './images/journal.jpg',
                stock: 10
            },
            {
                name: 'Executive Planner',
                description: 'Professional weekly planner with goal-setting sections.',
                price: 649.99,
                category: 'planners',
                tag: 'New',
                image_path: './images/planner.jpg',
                stock: 15
            },
            {
                name: 'Fountain Pen Set',
                description: 'Premium fountain pen with interchangeable nibs.',
                price: 1299.99,
                category: 'pens',
                tag: 'Premium',
                image_path: './images/pen.jpg',
                stock: 8
            },
            {
                name: 'Stationery Gift Set',
                description: 'Complete set including notebook, pen, and accessories.',
                price: 1499.99,
                category: 'gifts',
                tag: 'Gift',
                image_path: './images/gifts.jpg',
                stock: 5
            },
            {
                name: 'Sketch Art Notebook',
                description: 'Heavyweight paper notebook for sketching.',
                price: 549.99,
                category: 'journals',
                tag: 'Artist',
                image_path: './images/art.jpg',
                stock: 20
            },
            {
                name: 'Professional Pen Case',
                description: 'Leather pen case with multiple slots.',
                price: 749.99,
                category: 'accessories',
                tag: 'Accessory',
                image_path: './images/pen-case.jpg',
                stock: 12
            }
        ];

        for (const product of sampleProducts) {
            await sql`
                INSERT INTO products (name, description, price, category, tag, image_path, stock)
                VALUES (
                    ${product.name}, 
                    ${product.description}, 
                    ${product.price}, 
                    ${product.category}, 
                    ${product.tag}, 
                    ${product.image_path}, 
                    ${product.stock}
                )
                ON CONFLICT DO NOTHING
            `;
        }
        console.log('✅ Sample products inserted');

        console.log('🎉 Database setup complete!');
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

setupDatabase();