/**
 * @openapi
 * /api/v1/chat/{conversationId}:
 *     get:
 *         summary: WebSocket handshake to start AI chat
 *         description: |
 *             This endpoint upgrades the connection to a WebSocket (protocol: `ws`).
 *
 *             After the connection is established, the client can:
 *
 *             - Send plain-text messages (one per frame)
 *             - Receive plain-text AI responses (one per frame)
 *
 *             **Example client usage:**
 *             ```ts
 *             const ws = new WebSocket("ws://localhost/api/v1/chat/123");
 *             ws.onmessage = e => console.log("AI:", e);
 *             ws.send("Hello AI");
 *             ```
 *
 *             This endpoint is not meant for HTTP calls, it upgrades immediately to WebSocket.
 *         parameters:
 *             - name: conversationId
 *               in: path
 *               required: true
 *               schema:
 *                   type: integer
 *               description: The conversation ID to bind this chat session to.
 *         servers:
 *             - url: ws://localhost.com
 *               description: WebSocket server only
 *         responses:
 *             '101':
 *                 description: Connection upgraded to WebSocket
 */
