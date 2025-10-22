# Electron Widgets Docs

This directory hosts the VitePress documentation for Electron Widgets.

## Local Development

```bash
npm install
npm run docs:dev
```

## Static Build

```bash
npm run docs:build
```

## Docker Deployment

```bash
docker build -t electron-widgets-docs .
docker run -p 8080:80 electron-widgets-docs
```

The Docker image builds the static site and serves it via Nginx, which makes it straightforward to deploy on platforms such as Coolify.
