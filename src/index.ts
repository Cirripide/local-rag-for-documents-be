import express from "express";
import dotenv from "dotenv";
import RagService from "./services/rag";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import v1Router from "./routes/v1"
import {MessageDao} from "./daos/message-dao";

dotenv.config();

const app = express();
app.use(express.json());

const ragService = new RagService();

app.use('/api/v1', v1Router);

app.post('/test/:convId', async (req, res) => {

    try {
        const conversationId = req.params?.convId ? +req.params.convId : 1;
        const messageDao = new MessageDao();
        const answer = req.body.answer;
        const humanMessage = await messageDao.createMessage({
            from: "Human",
            message: answer,
            conversationId: conversationId
        });

        const ragRes = await ragService.answer(answer);
        await messageDao.createMessage({
            from: "Ai",
            message: ragRes,
            conversationId: conversationId
        });
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
