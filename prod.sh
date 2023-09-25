docker build -t aksarantara-fe -f Dockerfile.prod . && \
    docker run --name aksarantara-fe -d -p 8080:3000 aksarantara-fe
