// netlify/functions/get-customers.js
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
        const customers = await sql('SELECT * FROM customers ORDER BY joined DESC');
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(customers)
        };
    } catch (error) {
        console.error('Error fetching customers:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};