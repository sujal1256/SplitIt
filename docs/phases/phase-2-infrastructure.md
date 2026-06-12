# Phase 2 — Infrastructure: Docker + Local Dev

**Difficulty:** 5/10 | **Engineering Value:** 8/10 | **Resume Value:** 8/10

---

## Goal

Any engineer can clone the repo and run `docker compose up` to get a fully working
application — backend, frontend, PostgreSQL, Redis — in under 60 seconds. No manual
setup steps.

---

## Why It Matters

"It works on my machine" is a junior engineer problem. Docker guarantees the dev
environment matches production. It also signals to anyone who looks at your repo
that you take engineering hygiene seriously.

---

## What It Teaches

- Containerization: images, containers, volumes, networks
- Multi-stage Docker builds (separate build and runtime layers)
- Docker Compose for local service orchestration
- Health checks and service dependency ordering
- The difference between dev and prod container configuration

---

## Backend Dockerfile

Multi-stage build. The runtime image contains no devDependencies, no build tools.

```dockerfile
# Stage 1: Install dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime image
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY src ./src
EXPOSE 3000
USER node
CMD ["node", "src/index.js"]
```

**Why non-root (`USER node`):** Running as root inside a container means a container
escape gives the attacker root on the host. Always run as a non-root user.

**Why multi-stage:** Final image has no npm, no build tools, no devDependencies.
Smaller attack surface. Smaller image size (target: under 200MB).

---

## Frontend Dockerfile

```dockerfile
# Stage 1: Build static assets
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**nginx.conf** (required for SPA routing):

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000;
    }
}
```

---

## docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: splitit
      POSTGRES_USER: splitit
      POSTGRES_PASSWORD: localpassword
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U splitit"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./server
      target: runtime
    environment:
      DATABASE_URL: postgres://splitit:localpassword@postgres:5432/splitit
      REDIS_URL: redis://redis:6379
      JWT_SECRET: local-dev-secret-change-in-production
      NODE_ENV: development
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "3000:3000"
    volumes:
      - ./server/src:/app/src   # hot reload in dev

  frontend:
    build:
      context: ./client
      target: runtime
    ports:
      - "5173:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## .env.example

```bash
# Server
SERVER_PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgres://splitit:localpassword@localhost:5432/splitit

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRY=10d

# Email
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password   # Gmail App Password, not your account password

# App URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Sentry (Phase 7 — leave blank for local dev)
SENTRY_DSN=
```

---

## Acceptance Criteria

- [ ] `docker compose up` from a fresh clone starts all four services with no manual steps
- [ ] Backend container runs as non-root (`USER node`)
- [ ] Production backend image is under 200MB
- [ ] PostgreSQL data persists across `docker compose down` + `docker compose up` (volume)
- [ ] All services have health checks — backend waits for DB and Redis to be healthy
- [ ] `.env.example` documents every variable with a comment
- [ ] `README.md` Getting Started section: clone → compose up → working

---

## Interview Discussion Points

- "Why multi-stage builds?" — smaller image, no devDependencies in production
- "Why run containers as non-root?" — container escape risk
- "What is a Docker health check and why does it matter for service ordering?"
- "What is a named volume and why does DB data persist across restarts?"
