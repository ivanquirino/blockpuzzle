#!/bin/bash
podman secret create pvkey ~/.ssh/id_ed25519
podman secret create pubkey ~/.ssh/id_ed25519.pub

podman run --name blockpuzzle-dev -d -p 3000:3000 \
    --replace \
    --secret pvkey,target=/root/.ssh/id_ed25519,mode=0600 \
    --secret pubkey,target=/root/.ssh/id_ed25519.pub \
    blockpuzzle-dev