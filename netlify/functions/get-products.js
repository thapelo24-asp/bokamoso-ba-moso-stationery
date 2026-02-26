// netlify/functions/get-products.js
const { sql } = require('./db');

exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    try {
        console.log('Fetching products...');
        const products = await sql('SELECT * FROM products ORDER BY id');
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(products)
        };
    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to fetch products' })
        };
    }
};