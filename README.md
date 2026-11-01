# CSSA Lounge Tab/POS System

A React + TypeScript point-of-sale and tab tracking application for the CSSA Lounge, built as a plugin for the [Tessellate POS SDK](https://github.com/tessellatepos/sdk).

## Prerequisites

- **Node.js** `^20.19.0` or `>=22.12.0`
- **[Docker](https://www.docker.com/)** with Docker Compose. [Docker Desktop](https://www.docker.com/products/docker-desktop/) is recommended if you're new to Docker, and is required on Windows.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/umanitoba-cssa/cssa-lounge-system
cd cssa-lounge-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the plugin

Tessellate loads the plugin from the `dist` folder, so it must be built first:

```bash
npm run build
```

This produces `dist/index.js` and `dist/client.js`.

### 4. Run Tessellate

Start Tessellate with [Docker Compose](https://docs.docker.com/compose/):

```bash
docker compose up
```

Add `-d` to run it in the background.

Once running:

| Service    | URL                                            |
| ---------- | ---------------------------------------------- |
| Storefront | [http://localhost:5173](http://localhost:5173) |
| API        | [http://localhost:3000](http://localhost:3000) |

The plugin is loaded by the storefront and is not served as a standalone Vite page.

To stop the stack, press `Ctrl+C` if your terminal is attached. Otherwise run:

```bash
docker compose down
```

## Development workflow

After changing plugin client code, rebuild and refresh the browser:

```bash
npm run build
```

Alternatively, `npm run dev` rebuilds on file changes (`vite build --watch`), so you only need to refresh the browser.

### Express API (optional)

The separate Express API service is not part of the Tessellate plugin stack yet, but will be merged into it as development continues. To configure it locally, copy the example environment file:

```bash
cp .env.example .env
```

## Available scripts

| Script                | Description                                      |
| --------------------- | ------------------------------------------------ |
| `npm run build`       | Type-check with TypeScript and build the plugin  |
| `npm run dev`         | Rebuild the plugin on file changes               |
| `npm run dev:client`  | Run the legacy standalone Vite site (to be removed) |
| `npm run dev:server`  | Run the Express API with auto-reload             |
| `npm run lint`        | Run ESLint across the project                    |
| `npm run preview`     | Preview the production build (to be removed)     |

## Example plugin

For a reference on how Tessellate plugins are structured, see the official [example plugin](https://github.com/tessellatepos/plugin-example).