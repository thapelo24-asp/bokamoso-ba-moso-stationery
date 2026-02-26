// netlify/functions/save-message.js
const { sql } = require('./db');

exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    try {
        const messageData = JSON.parse(event.body);
        
        await sql`
            INSERT INTO messages (name, email, phone, subject, message, read, created_at)
            VALUES (
                ${messageData.name},
                ${messageData.email},
                ${messageData.phone || ''},
                ${messageData.subject},
                ${messageData.message},
                false,
                CURRENT_TIMESTAMP
            )
        `;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Error saving message:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};