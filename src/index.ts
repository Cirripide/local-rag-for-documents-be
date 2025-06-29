import express from "express";
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import expressWs from 'express-ws';
import v1Router from "./routes/v1"
import {chatWithAi} from "./controllers/chat-controller";

dotenv.config();

const { app } = expressWs(express());
app.use(express.json());

app.use('/api/v1', v1Router);
app.ws("/api/v1/chat/:conversationId",chatWithAi);

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Local RAG for Documents',
            version: '1.0.0',
            description: 'BE API Call Documentation',
        },
    },
    apis: ['./src/routes/v1/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(process.env["EXPRESS_PORT"]);
