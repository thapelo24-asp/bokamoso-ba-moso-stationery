// netlify/functions/place-order.js
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
        const orderData = JSON.parse(event.body);
        console.log('Processing order:', orderData.id);

        // Insert order
        await sql`
            INSERT INTO orders (
                id, customer_name, customer_email, customer_phone, 
                customer_id_number, items, shipping_address, 
                shipping_method, shipping_cost, subtotal, total, 
                payment_method, notes, status
            ) VALUES (
                ${orderData.id}, ${orderData.customer.name}, ${orderData.customer.email},
                ${orderData.customer.phone || ''}, ${orderData.customer.idNumber || ''},
                ${JSON.stringify(orderData.items)}, ${orderData.shipping.address},
                ${orderData.shipping.method || 'Standard'}, ${orderData.shipping.cost || 0},
                ${orderData.subtotal}, ${orderData.total}, ${orderData.payment.method},
                ${orderData.notes || ''}, ${orderData.status || 'pending'}
            )
        `;

        // Update customer
        await sql`
            INSERT INTO customers (name, email, phone, id_number, orders_count, total_spent, last_order)
            VALUES (
                ${orderData.customer.name}, ${orderData.customer.email},
                ${orderData.customer.phone || ''}, ${orderData.customer.idNumber || ''},
                1, ${orderData.total}, CURRENT_TIMESTAMP
            )
            ON CONFLICT (email) DO UPDATE SET
                orders_count = customers.orders_count + 1,
                total_spent = customers.total_spent + ${orderData.total},
                last_order = CURRENT_TIMESTAMP
        `;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, orderId: orderData.id })
        };
    } catch (error) {
        console.error('Error placing order:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};