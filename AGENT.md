# Docker Engine API CLI - Agent Instructions

This is the Docker Engine API CLI, part of the KTMCP project.

## What This CLI Does
- Manage Docker containers (list, start, stop, remove, logs)
- Manage Docker images (list, pull, remove, inspect)
- Manage Docker networks (list, create, remove)
- Manage Docker volumes (list, create, remove)
- Get system info and Docker version

## Authentication
Connects to `/var/run/docker.sock` by default (Unix socket).

## Common Commands
- `docker-api containers list` - List containers
- `docker-api images list` - List images
- `docker-api ping` - Check Docker daemon
- `docker-api info` - System information

## API Reference
https://docs.docker.com/engine/api/
