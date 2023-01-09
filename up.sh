echo "Making podman rootful"
podman machine set --rootful
sleep 2
echo "Starting podman"
podman machine start
sleep 5
echo "Starting postgres"
podman run --rm --name chat-data -v $(pwd)/data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
echo "Starting redis"
podman run --rm --name chat-redis -d redis