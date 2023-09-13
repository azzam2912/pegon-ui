docker build -t aksarantara-fe -f Dockerfile.prod . && \
    docker run -p 8080:3000 aksarantara-fe
