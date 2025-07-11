#!/bin/bash

# If the .env file doesn't exist than stop the script
if ! [ -s ".env" ];
then
  echo "The .env file doesn't exist"
  exit 1
fi

# Load .env variables
set -a && source .env && set +a

# Variables
has_ollama=$([ "$(command -v ollama)" != '' ] && echo 'true' || echo 'false')
has_brew=$([ "$(command -v brew)" != '' ] && echo 'true' || echo 'false')
has_docker=$([ "$(command -v docker)" != '' ] && echo 'true' || echo 'false' )

# If the user doesn't have Homebrew on the system notify it about
if [ "$has_brew" == 'false' ]
then
  echo "You should install brew before. After install it then restart this script. More info at https://brew.sh"
fi

# Check if Docker is installed
if [ "$has_docker" == "false" ];
then
  echo "Installing Docker..."
  brew install --quiet docker
fi

if ! docker info > /dev/null 2>&1; then
  echo "Docker daemon is not running. Starting it now..."

  OS="$(uname)"
  if [ "$OS" == "Darwin" ]; then
    # macOS: launch Docker Desktop
    open --background -a Docker
  elif [ "$OS" == "Linux" ]; then
    # Linux: start the Docker service (requires sudo)
    sudo systemctl start docker || sudo service docker start
  else
    echo "Unrecognized OS ($OS), please start Docker manually."
    exit 1
  fi

  # Wait for Docker to become available
  echo -n "Waiting for Docker"
  until docker info > /dev/null 2>&1; do
    echo -n "."
    sleep 1
  done
  echo
  echo "Docker daemon is now running!"
fi

# Check if Ollama is installed
if [ "$has_ollama" == "false" ];
then
  echo "Installing Ollama..."
  brew install --quiet ollama
fi

# If EMBEDDINGS_LLM_MODEL or LLM_MODEL aren't set up then stop the script
if [ -z "${EMBEDDINGS_LLM_MODEL}" ] || [ -z "${LLM_MODEL}" ] || [ -z "${LOCAL_LLM_MODEL_NAME}" ];
then
  echo "You must set EMBEDDINGS_LLM_MODEL, LLM_MODEL and LOCAL_LLM_MODEL_NAME variables inside the .env file"
  exit 1
fi

echo "Pulling llm model..."
# Install llm model
ollama pull "${LLM_MODEL}"

echo "Pulling embeddings llm model..."
# Install embeddings llm model
ollama pull "${EMBEDDINGS_LLM_MODEL}"

# Replace 'FROM model' from Modelfle, create Ollama model
sed "1 s/BASE_MODEL/${LLM_MODEL}/" Modelfile | ollama create "${LOCAL_LLM_MODEL_NAME}"

# Start the project
docker compose watch
