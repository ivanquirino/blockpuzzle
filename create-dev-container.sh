#!/bin/bash
podman run --name blockpuzzle-dev -ti -p 3000:3000 \
    --replace \
    -v ~/.ssh:/root/.ssh:z \
    blockpuzzle-dev