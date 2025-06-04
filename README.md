# Rag for Documents

RAG for documents is a project that aims to create a RAG capable of indexing documents starting from a folder and all its subfolders.

At the moment the supported documents are:
- .docx
- .txt
- .pdf


## Usage

Copy the project locally, then create the .env file from the example one.

The chosen document folder inside the `.env` file will be linked inside the container as read-only volume. So you're assured that your file won't change

To execute the project locally execute:
```sh
docker compose watch
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
