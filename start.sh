# #!/bin/bash

# # Path to your settings.json file
# CONFIG_PATH="settings.json"

# # Name of the IPFS container
# CONTAINER_NAME="ipfs_host"

# # Copy the configuration file to the container
# docker cp "$CONFIG_PATH" "$CONTAINER_NAME:/$CONFIG_PATH"

# # Replace the configuration
# docker exec -it "$CONTAINER_NAME" ipfs config replace "$CONFIG_PATH"

# # Restart the container
# docker restart "$CONTAINER_NAME"

# # Verify the new configuration
# docker exec -it "$CONTAINER_NAME" ipfs config show
CONTAINER_NAME='ipfs_host'
CONFIG='{"Access-Control-Allow-Headers": ["X-Requested-With","Range"],"Access-Control-Allow-Methods": ["POST","GET"],"Access-Control-Allow-Origin": ["*"]}'

docker exec -it "$CONTAINER_NAME" ipfs config --json API.HTTPHeaders "$CONFIG"

docker restart "$CONTAINER_NAME"

docker exec -it "$CONTAINER_NAME" ipfs config show