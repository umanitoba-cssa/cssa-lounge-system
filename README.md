# CSSA Lounge Tab/POS System

A React + TypeScript point-of-sale and tab tracking application built for the CSSA Lounge, using the [Tesselate POS SDK](https://github.com/tessellatepos/sdk).

## Prerequisites

* **Node.js**: `v22.0.0` or higher
* **npm**: `v10.0.0` or higher

## Getting Started

### 1. Clone the Repository

Clone the project along with its Git submodules:
```bash
git clone --recursive https://github.com/umanitoba-cssa/cssa-lounge-system
cd cssa-lounge-system
```

**Note:** If you already cloned without `--recursive`, initialize the submodule manually:

```bash
git submodule update --init --recursive
```

### 2. Install Dependencies

Install Node.js packages with

```bash
npm install
```

Install [Docker](https://www.docker.com/) or [Docker Desktop](https://www.docker.com/products/docker-desktop/). Docker Desktop gives a full GUI and will be a bit easier to use if you aren't familiar with Docker, and is required for Windows development.

### 3. Development Server

Start the Vite development server and backend with local submodules linked:
```bash
npm run dev
```

Copy `.env.example` into `.env` and start the database:
```bash
docker compose up
```

## Available Scripts


* `npm run dev` - Start local development server with Vite
* `npm run build` - Compile TypeScript types and build production assets
* `npm run preview` - Preview the production build locally
* `npm run lint` - Run ESLint across application source files

