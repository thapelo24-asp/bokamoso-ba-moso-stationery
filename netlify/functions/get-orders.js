// netlify/functions/get-orders.js
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
        const orders = await sql('SELECT * FROM orders ORDER BY created_at DESC');
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(orders)
        };
    } catch (error) {
        console.error('Error fetching orders:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};