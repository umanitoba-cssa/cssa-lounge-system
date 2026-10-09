# CSSA Lounge Tab/POS System

A React + TypeScript point-of-sale and tab tracking application built for the CSSA Lounge, using the [Tesselate POS SDK](https://github.com/tessellatepos/sdk).

## Prerequisites

* **Node.js**: `v22.0.0` or higher
* **npm**: `v10.0.0` or higher

## Getting Started

### 1. Clone the Repository

Clone the project:
```bash
git clone https://github.com/umanitoba-cssa/cssa-lounge-system
cd cssa-lounge-system
```

### 2. Install Dependencies

Install Node.js packages with

```bash
npm install
```

Install [Docker](https://www.docker.com/) or [Docker Desktop](https://www.docker.com/products/docker-desktop/). Docker Desktop gives a full GUI and will be a bit easier to use if you aren't familiar with Docker, and is required for Windows development.

### 3. Build the plugin

To have Tessellate pick up on the plugin we need to first build it so Tessellate can read the built plugin from `dist`, to do this run:

```bash
npm run dev
```

This should write `dist/index.js` and `dist/client.js`

### 4. Run Tessellate 

With the plugin built, we can now run Tessellate using [Docker Compose](https://docs.docker.com/compose/):

```
docker compose up
```

(or use `docker compose up -d` if you want it to run in the background)

Once running, the storefront is available at [http://localhost:5173](http://localhost:5173). The plugin is loaded by the storefront; it is not served as a standalone Vite page. Plugin client changes require another `npm run build` and a browser refresh.

If your terminal is attached, you can stop the stack with `Ctrl+C`, otherwise run:

```bash
docker compose down
```

For local configuration of the separate Express API service, copy `.env.example` into `.env`. That service is not part of the Tessellate plugin development stack but will likely be merged into it as we continue development.

## Available Scripts

* `npm run dev` - Build the plugin and start the local Tessellate stack
* `npm run build` - Compile TypeScript types and build production assets
* `npm run preview` - Preview the production build locally
* `npm run lint` - Run ESLint across application source files

## Example plugin 

To see an example of what a plugin looks like and how they function, check out the official Tessellate [example plugin](https://github.com/tessellatepos/plugin-example).