import express from "express";
import dotenv from "dotenv";
import RagService from "./services/rag";
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
})

app.listen(process.env["EXPRESS_PORT"]);
