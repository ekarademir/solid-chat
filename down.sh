echo "Stopping redis"
podman stop chat-redis
echo "Stopping postgres"
podman stop chat-data
echo "Stopping podman"
podman machine stop