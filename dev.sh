docker build -t aksarantara-fe-dev -f Dockerfile.dev .
# docker run --add-host host.docker.internal:host-gateway -p 8080:3000 -v $(pwd)/src:/app/src -v $(pwd)/node_modules:/app/node_modules aksarantara-fe-dev
docker run --name aksarantara-fe --network="host" -p 8080:3000 -v $(pwd)/src:/app/src -v $(pwd)/node_modules:/app/node_modules aksarantara-fe-dev 
