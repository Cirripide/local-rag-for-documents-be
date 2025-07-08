# Local RAG for Documents BE

Backend of a fully local [RAG](https://en.wikipedia.org/wiki/Retrieval-augmented_generation) (privacy-first), where data never leaves the device on which it is processed.
All information is stored locally on the device, and communication with the LLM also occurs on-device, without any cloud involvement.

The file formats supported by the RAG are:
- .docx
- .txt
- .pdf

## Initialization

To set up the project locally:

1. **Clone the repository**  
Clone the repository by following the official GitHub instructions:  
[Cloning a repository – GitHub Docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

2. **Install dependencies using NVM**  
Make sure you have [`nvm` (Node Version Manager)](https://github.com/nvm-sh/nvm#installing-and-updating) installed on your system.
After installation, restart your terminal, then navigate to the project directory and run:

    ```bash
    nvm use && npm install
    ```
3. **Configure the environment file**  
   Rename the file `example.env` to `.env` and edit its content with your desired settings:

    - `ASSISTANT_NAME="Finn"`  
      Name you want the virtual assistant to have.

    - `LANGUAGE="English"`  
      Language the assistant will use to interact with the user.

    - `LLM_MODEL="gemma3:4b"`  
      Name of the language model to use via [Ollama's model library](https://ollama.com/library).
      > 💡 Choose a model compatible with your GPU and desired performance.  
      > The quality of the assistant's responses depends heavily on the selected model.

    - `EMBEDDINGS_LLM_MODEL="mxbai-embed-large:335m"`  
      Name of the embedding model, from [Ollama's embedding model catalog](https://ollama.com/search?c=embedding).
      > ⚠️ Embedding quality directly affects the retrieval accuracy.  
      > Make sure to select a model that fits your performance/memory constraints and GPU capabilities.

    - `LOCAL_LLM_MODEL_NAME="finn-assistant"`  
      Name for the local fine-tuned model (currently not used by the system, reserved for future extensions).

    - `CHROMA_URL="http://chromadb:8000"`  
      URL for the Chroma vector database.
      > Leave this as-is unless you know exactly what you're doing.

    - `CHROMA_COLLECTION_NAME="rag-chunks"`  
      Name of the Chroma collection.
      > ⚠️ If you change the embedding model, you **must** change the collection name and re-index all documents.

    - `EXPRESS_PORT="3000"`  
      Internal backend port for Express.

    - `SERVER_PORT="80"`  
      Public-facing port of the server.

    - `MYSQL_PASSWORD="password"`  
      Password for the root user of the MySQL database.

    - `MYSQL_DATABASE_NAME="rag"`  
      Name of the database used to store metadata and user data.

    - `MYSQL_DATABASE_URL="mysql://root:${MYSQL_PASSWORD}@db:3306/${MYSQL_DATABASE_NAME}"`  
      Full connection string to the database.

    - `FOLDER_PATH=""`  
      Path to the folder containing the documents to be processed by the RAG.
      > The system will **recursively read** all files within this folder and all of its subfolders.

4. **Start the project**  
    If you're using **macOS**, open the terminal in the root of the project and run:

    ```bash
    ./start.sh
    ```

    This script will install the remaining dependencies and ***start the project automatically***.

    If you're on a **different operating system** or if the script doesn't work, follow these steps manually:

### Install dependencies

- **Install and start Docker**  
  [https://www.docker.com/get-started](https://www.docker.com/get-started)

- **Install Ollama**  
  [https://ollama.com/download](https://ollama.com/download)

- **Download the required models using Ollama**  
  From your terminal, run the following commands using the values from your `.env` file:

  ```bash
  ollama pull <LLM_MODEL>
  ollama pull <EMBEDDINGS_LLM_MODEL> 
  ```
  Replace `<LLM_MODEL>` and `<EMBEDDINGS_LLM_MODEL>` with the actual values you defined in your `.env` file  
  (e.g., `gemma3:4b`, `mxbai-embed-large:335m`).

> 📌 **Make sure your GPU is compatible with the selected models.**  
> Both generation and embedding quality depend on the models you choose and the capabilities of your hardware.

### Start the project

In the root of the project directory, run:

```bash
docker compose up
```

### Logging

To monitor the backend and service logs in real-time, run the following command from the root of the project:

```bash
npm run dev:logs
```

Useful for debugging and ensuring all services (LLM, Chroma, MySQL, etc.) are running as expected.


## Usage

Once the service is running, you can interact with it via both **API** and **WebSocket** interfaces.

- 📚 **API Documentation** is available at:  
  [http://localhost/api-docs/](http://localhost/api-docs/)

- 📡 **WebSocket Documentation** is available at:  
  [http://localhost/ws-docs/](http://localhost/ws-docs/)

---

### Indexing Behavior

At first initialization, the system performs an automatic **initial indexing** of the document files.  
The **current state of indexing** is available in real-time via WebSocket updates.

> ℹ️ During indexing, the assistant is **not available for interaction**.

---

### Starting a Conversation

Before interacting with the assistant, you must:

1. **Create a new conversation** using the appropriate API endpoint (see [API docs](http://localhost/api-docs/)).
2. **Start communicating** with the assistant via WebSocket (see [WebSocket docs](http://localhost/ws-docs/)).

All messages exchanged within a conversation are **persisted**, so you can later retrieve past interactions by providing the corresponding `conversationId` in your WebSocket messages.

---

### Features Available in Swagger

Inside the Swagger UI (`/api-docs`), you can explore all available API operations, including:

- Creating and retrieving conversations
- Accessing message history
- Triggering a **reindexing** of the document folder

> ⚠️ **Reindexing deletes all existing vectorized chunks in the database** and regenerates them from scratch.  
> During this process, the assistant is **unavailable**.


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
