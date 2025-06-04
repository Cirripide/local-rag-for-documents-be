# Rag for Documents

RAG for documents is a project that aims to create a RAG capable of indexing documents starting from a folder and all its subfolders.

At the moment the supported documents are:
- .docx
- .txt
- .pdf


## Usage

Copy the project locally, then create the .env file from the example one.

If you don't have the Chroma Docker image, proceed to pull it

```
npm run dev:pull-chroma
```

Launch Chroma via Docker

```
npm run dev:run-chroma
```


From terminal index the contents of the folder indicated in the .env file

```
npm run dev:indexing
```

Once the indexing process is finished it starts communicating

```
npm run dev
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
