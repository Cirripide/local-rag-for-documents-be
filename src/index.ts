import express from "express";
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import expressWs from 'express-ws';
import v1Router from "./routes/v1"
import {chatWithAi} from "./controllers/chat-controller";
import {indexer} from "./services/indexer";
import {indexingStatusController} from "./controllers/indexing-controller";


dotenv.config();

const { app } = expressWs(express());
app.use(express.json());

app.use('/api/v1', v1Router);

app.ws("/api/v1/chat/:conversationId", chatWithAi);
app.ws("/api/v1/indexing", indexingStatusController);

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Local RAG for Documents',
            version: '1.0.0',
            description: 'BE API Call Documentation',
        },
        servers: [
            {
                url: 'http://localhost.com',
                description: 'HTTP REST server',
            }
        ]
    },
    apis: ['./src/routes/v1/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Async API UI
app.use('/ws-docs', express.static('src/ws-docs/'));

app.listen(process.env["EXPRESS_PORT"]);

// first RAG indexing
await indexer.index();
