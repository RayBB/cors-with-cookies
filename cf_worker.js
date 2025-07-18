// This is an AI Generated cloudflare worker version
// Worker entry point
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Health check route
        if (url.pathname === '/' && request.method === 'GET') {
            const response = new Response(JSON.stringify({ status: 'ok' }), {
                headers: { 'Content-Type': 'application/json' }
            });
            // Add CORS headers for the health check if needed
            response.headers.set('Access-Control-Allow-Origin', '*');
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
            return response;
        }

        // Handle preflight OPTIONS request for CORS
        if (request.method === 'OPTIONS') {
            const headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || 'Content-Type',
                'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
            };
            return new Response(null, { status: 204, headers });
        }

        // Main proxy endpoint
        if (url.pathname === '/proxy' && request.method === 'POST') {

            try {
                const { url: targetUrl, method, headers = {}, body } = await request.json();

                // Validate required fields
                if (!targetUrl || !method) {
                    return new Response(JSON.stringify({ error: 'URL and method are required' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                    });
                }

                // Prepare request configuration for native fetch
                const fetchConfig = {
                    method: method,
                    headers: headers,
                    body: body ? JSON.stringify(body) : undefined, // Ensure body is stringified if it's an object
                    // Cloudflare Workers fetch automatically handles `withCredentials` and large bodies internally
                    // maxContentLength, maxBodyLength are axios specific, not needed for native fetch
                    // You might need to adjust 'headers' to remove host, origin etc. if you are doing a proxy to prevent issues.
                    // For a general proxy, you might want to strip 'Host', 'User-Agent', 'Content-Length'
                    // and other headers that might cause issues for the target server or reveal info about the proxy.
                    // Example:
                    // const outgoingHeaders = new Headers(headers);
                    // outgoingHeaders.delete('Host'); // Very important for proxying!
                    // outgoingHeaders.delete('User-Agent');
                    // outgoingHeaders.delete('Content-Length'); // fetch handles this
                };

                // If the body is not a string, ensure it's sent correctly, e.g., for JSON
                if (typeof body === 'object' && body !== null) {
                    fetchConfig.body = JSON.stringify(body);
                    // Ensure content-type header is set correctly for JSON body
                    if (!fetchConfig.headers['Content-Type']) {
                        fetchConfig.headers['Content-Type'] = 'application/json';
                    }
                }


                // Make the request using native fetch
                const response = await fetch(targetUrl, fetchConfig);

                // Prepare the response for the client
                const responseHeaders = new Headers(response.headers);
                responseHeaders.set('Access-Control-Allow-Origin', '*'); // Allow all origins for the proxy response
                // Propagate other CORS headers if the target provides them, or set them as needed
                responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
                responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: responseHeaders,
                });

            } catch (error) {
                // Handle errors
                const status = error.response?.status || 500;
                const message = error.response?.data || error.message;

                const errorResponse = new Response(JSON.stringify({ error: message }), {
                    status: status,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
                errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
                errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
                return errorResponse;
            }
        }

        // Default response for unhandled routes
        return new Response('Not Found', { status: 404 });
    },
};