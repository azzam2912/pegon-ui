git submodule sync
git pull --recurse-submodules
git submodule update --init --recursive --remote
for submodule in $(git submodule | awk '{ print $2 }'); do
  cd $submodule

  # Check if there's nothing at all
  if [ $(ls -A | wc -l) -eq 0 ]; then
    echo "Submodule $submodule is empty"
    exit 1
  fi
  # Check if submodule only contains .git folder
  if [ $(ls -a | wc -l) -eq 1 ]; then
    echo "Submodule $submodule only contains one file: $(ls -a)"
    exit 1 # Exit with an error code
  fi

  cd ~-
done
docker build -t aksarantara-fe -f Dockerfile.prod . && \
    docker run --name aksarantara-fe -d -p 8080:3000 aksarantara-fe
