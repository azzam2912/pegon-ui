docker build -t aksarantara-fe-dev -f Dockerfile.dev .
docker run -p 8080:3000 -v $(pwd)/src:/app/src -v $(pwd)/node_modules:/app/node_modules aksarantara-fe-dev