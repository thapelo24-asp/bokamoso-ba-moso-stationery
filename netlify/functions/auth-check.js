// netlify/functions/auth-check.js
exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    const user = context.clientContext?.user;
    
    if (!user) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ authenticated: false })
        };
    }
    
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            authenticated: true,
            user: {
                email: user.email
            }
        })
    };
};