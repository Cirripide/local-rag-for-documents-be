import express from "express";
import dotenv from "dotenv";
import RagService from "./services/rag";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import v1Router from "./routes/v1"

dotenv.config();

const app = express();
app.use(express.json());

const ragService = new RagService();

app.use('/api/v1', v1Router);

app.post('/test', async (req, res) => {

    try {
        const answer = req.body.answer;
        const ragRes = await ragService.answer(answer);
        res.json(ragRes);
    } catch(e) {
        if (e instanceof Error) {
            res.status(500).send(e.message);
        } else {
            res.status(500).send("Errore sconosciuto");
        }
    }
});

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
