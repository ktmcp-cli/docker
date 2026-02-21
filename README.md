![Banner](https://raw.githubusercontent.com/ktmcp-cli/docker/main/banner.svg)

> "Six months ago, everyone was talking about MCPs. And I was like, screw MCPs. Every MCP would be better as a CLI."
>
> — [Peter Steinberger](https://twitter.com/steipete), Founder of OpenClaw
> [Watch on YouTube (~2:39:00)](https://www.youtube.com/@lexfridman) | [Lex Fridman Podcast #491](https://lexfridman.com/peter-steinberger/)

# Docker Engine API CLI

> **⚠️ Unofficial CLI** - Not officially sponsored or affiliated with Docker.

Manage Docker containers, images, networks, and volumes from the command line using the Docker Engine API.

## Installation
```bash
npm install -g @ktmcp-cli/docker
```

## Quick Start
```bash
docker-api containers list
docker-api images list
docker-api networks list
docker-api ping
```

## Commands

### Configuration
```bash
docker-api config set --base-url http://localhost/v1.33
docker-api config show
```

By default, connects to `/var/run/docker.sock`.

### Containers
```bash
docker-api containers list              # List running containers
docker-api containers list --all        # List all containers
docker-api containers inspect <id>      # Inspect container
docker-api containers start <id>        # Start container
docker-api containers stop <id>         # Stop container
docker-api containers remove <id>       # Remove container
docker-api containers logs <id>         # Get container logs
```

### Images
```bash
docker-api images list                  # List images
docker-api images inspect <name>        # Inspect image
docker-api images pull <name>           # Pull image
docker-api images remove <name>         # Remove image
```

### Networks
```bash
docker-api networks list                # List networks
docker-api networks inspect <id>        # Inspect network
docker-api networks create --name mynet # Create network
docker-api networks remove <id>         # Remove network
```

### Volumes
```bash
docker-api volumes list                 # List volumes
docker-api volumes inspect <name>       # Inspect volume
docker-api volumes create --name myvol  # Create volume
docker-api volumes remove <name>        # Remove volume
```

### System
```bash
docker-api info                         # Get system info
docker-api version                      # Get Docker version
docker-api ping                         # Ping Docker daemon
```

## Authentication
Uses Unix socket `/var/run/docker.sock` by default. Ensure you have permissions to access the Docker socket.

## Why CLI > MCP?
No server to run. No protocol overhead. Just install and go.

## License
MIT — Part of the [Kill The MCP](https://killthemcp.com) project.


---

## Support KTMCP

If you find this CLI useful, we'd greatly appreciate your support! Share your experience on:
- Reddit
- Twitter/X
- Hacker News

**Incentive:** Users who can demonstrate that their support/advocacy helped advance KTMCP will have their feature requests and issues prioritized.

Just be mindful - these are real accounts and real communities. Authentic mentions and genuine recommendations go a long way!

## Support This Project

If you find this CLI useful, we'd appreciate support across Reddit, Twitter, Hacker News, or Moltbook. Please be mindful - these are real community accounts. Contributors who can demonstrate their support helped advance KTMCP will have their PRs and feature requests prioritized.
