# SplitIt — Complete Task Backlog

Ordered by dependency. Each item is one PR. Check off as you go.

---

## Phase 1 — Architecture Redesign

- [ ] Write ADR-001: MongoDB → PostgreSQL decision
- [ ] Set up `node-pg-migrate`, create migrations 001–009
- [ ] Write seed script with realistic data (3 users, 2 groups, 10 expenses)
- [ ] Implement repository layer (`user`, `group`, `expense`, `settlement`)
- [ ] Implement service layer (`user`, `group`, `expense`, `balance`)
- [ ] Refactor controllers to call service layer only — no SQL, no business logic
- [ ] Migrate user data from MongoDB to PostgreSQL
- [ ] Migrate group data from MongoDB to PostgreSQL
- [ ] Migrate expense data from MongoDB to PostgreSQL
- [ ] Remove Mongoose dependency from `server/package.json`

## Phase 2 — Infrastructure

- [ ] Write backend Dockerfile (multi-stage: builder + runtime, non-root user)
- [ ] Write frontend Dockerfile (multi-stage: Vite build + nginx serve)
- [ ] Write `docker-compose.yml` with health checks on all services
- [ ] Write `.env.example` documenting every required variable
- [ ] Update `README.md` — Getting Started section: clone → compose up → working in <5 min

## Phase 3 — Security Hardening

- [ ] Add Zod validation to all request bodies and query params
- [ ] Fix password reset: move OTP to Redis with 10-min TTL, issue single-use reset token
- [ ] Rebuild invite flow: cryptographic token, stored in `invitations` table, expires in 7 days
- [ ] Remove default password (`"default"`) — invited users set their own password
- [ ] Implement RBAC middleware (`requireGroupPermission`) with group-level roles
- [ ] Apply RBAC to all routes that modify group or expense data
- [ ] Add Helmet security headers + Content Security Policy
- [ ] Add Redis-backed rate limiting on auth endpoints (10 req / 15 min)
- [ ] Add JWT blocklist: on logout and password change, invalidate token via Redis
- [ ] Remove all `console.log` from production code paths
- [ ] Write ADR-002: Security model and RBAC design

## Phase 4 — Redis Integration

- [ ] Set up Redis client with connection error handling and graceful fallback
- [ ] Implement OTP storage in Redis (replaces DB column)
- [ ] Implement balance calculation cache per group — invalidate on expense write/delete/settlement
- [ ] Implement JWT blocklist using `jti` claim + Redis TTL
- [ ] Implement Redis-backed rate limiting (replaces any in-memory store)

## Phase 5 — Testing

- [ ] Set up Vitest + Supertest + testcontainers
- [ ] Write test factories and `beforeAll`/`afterAll` DB setup helpers
- [ ] Write balance service unit tests — minimum 8 cases:
  - Zero expenses → zero balances
  - Equal split two members
  - Net balances sum to zero
  - Settlements reduce balance
  - Payer not in participants
  - Three-way split
  - Multiple expenses same group
  - Soft-deleted expenses excluded
- [ ] Write auth integration tests (register → login → protected route → logout → rejected)
- [ ] Write expense API integration tests (happy path + validation errors + auth errors)
- [ ] Write RBAC integration tests (member blocked from admin actions)
- [ ] Write invitation flow integration tests (invite → accept → member added → token expired)
- [ ] Configure Vitest coverage thresholds: 80% on `src/services/`

## Phase 6 — CI/CD

- [ ] Write GitHub Actions `lint` job
- [ ] Write GitHub Actions `test` job with real PostgreSQL + Redis services
- [ ] Write GitHub Actions `build` job — Docker image tagged with git SHA, pushed to GHCR
- [ ] Configure branch protection on `main` — no direct pushes, CI must pass
- [ ] Write ADR-003: Deployment pipeline design

## Phase 7 — Observability

- [ ] Replace all `console.log` with Pino structured logger
- [ ] Add correlation ID middleware — generate UUID per request, attach to logs and response headers
- [ ] Add request/response logging middleware — method, url, statusCode, duration, correlationId
- [ ] Implement `GET /health` — checks DB + Redis, returns 200 or 503
- [ ] Set up Sentry — capture all unhandled exceptions with user context and correlationId
- [ ] Add global error handler that uses Sentry + structured logger

## Phase 8 — Real Product Features

- [ ] Implement settlement persistence — wrap in DB transaction with audit log entry
- [ ] Implement expense editing — update fields + write audit log with before/after JSONB
- [ ] Implement leave group (user removes themselves, expenses remain)
- [ ] Implement remove member (admin only, RBAC enforced)
- [ ] Add WebSocket server — group rooms, emit `expense:created` and `balance:updated`
- [ ] Update frontend GroupDetails to receive WebSocket events and refresh balance cards

## Phase 9 — Scalability

- [ ] Add all missing foreign key indexes — verify with `pg_stat_user_indexes`
- [ ] Add partial index on `expenses(deleted_at) WHERE deleted_at IS NULL`
- [ ] Run `EXPLAIN ANALYZE` on all major queries, commit output to `docs/query-analysis.md`
- [ ] Implement cursor-based pagination for expense listing
- [ ] Add pagination to group listing
- [ ] Document balance calculation time complexity in `docs/query-analysis.md`

## Phase 10 — Cloud Deployment

- [ ] Write Terraform: VPC + public/private subnets
- [ ] Write Terraform: RDS PostgreSQL (db.t3.micro)
- [ ] Write Terraform: ElastiCache Redis (cache.t3.micro)
- [ ] Write Terraform: ECS cluster + Fargate service (2 tasks)
- [ ] Write Terraform: Application Load Balancer
- [ ] Write Terraform: CloudFront distribution + S3 bucket for frontend
- [ ] Configure ECR and image push step in GitHub Actions
- [ ] Configure ECS deployment step in GitHub Actions (deploy on merge to main)
- [ ] Set up CloudWatch alarms: 5xx rate > 1%, CPU > 80%, DB connections > 80%
- [ ] Register domain and configure Route 53
- [ ] Write ADR-004: Cloud architecture decisions and cost tradeoffs
