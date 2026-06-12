# SplitIt — Production Engineering Roadmap

> Goal: Transform SplitIt from a working prototype into a production-grade,
> senior-level engineering project that stands out on a resume and holds up
> in system design interviews.

---

## Quick Links

| Document | Description |
|---|---|
| [BACKLOG.md](./BACKLOG.md) | Complete ordered task list |
| [Phase 1 — Architecture](./phases/phase-1-architecture.md) | PostgreSQL migration, schema design, layered architecture |
| [Phase 2 — Infrastructure](./phases/phase-2-infrastructure.md) | Docker, docker-compose, local dev |
| [Phase 3 — Security](./phases/phase-3-security.md) | Auth hardening, RBAC, rate limiting, input validation |
| [Phase 4 — Redis](./phases/phase-4-redis.md) | Caching, OTP, JWT blocklist, rate limiting |
| [Phase 5 — Testing](./phases/phase-5-testing.md) | Unit, integration, business logic coverage |
| [Phase 6 — CI/CD](./phases/phase-6-cicd.md) | GitHub Actions, Docker builds, branch protection |
| [Phase 7 — Observability](./phases/phase-7-observability.md) | Structured logging, health checks, Sentry |
| [Phase 8 — Features](./phases/phase-8-features.md) | Settlements, audit log, real-time, leave group |
| [Phase 9 — Scalability](./phases/phase-9-scalability.md) | Indexing, pagination, query optimization |
| [Phase 10 — Cloud](./phases/phase-10-cloud.md) | AWS architecture, Terraform, production deployment |
| [ADR Template](./decisions/ADR-000-template.md) | How to write an Architecture Decision Record |
| [ADR-001](./decisions/ADR-001-postgresql-migration.md) | Why PostgreSQL over MongoDB |

---

## Phase Summary

| Phase | Focus | Difficulty | Eng Value | Resume Value |
|---|---|---|---|---|
| 1 | Architecture — PostgreSQL + layered architecture | 8/10 | 10/10 | 9/10 |
| 2 | Infrastructure — Docker + local dev | 5/10 | 8/10 | 8/10 |
| 3 | Security hardening | 6/10 | 10/10 | 9/10 |
| 4 | Redis integration | 5/10 | 8/10 | 8/10 |
| 5 | Testing | 7/10 | 10/10 | 9/10 |
| 6 | CI/CD | 5/10 | 8/10 | 8/10 |
| 7 | Observability | 6/10 | 9/10 | 8/10 |
| 8 | Real product features | 6/10 | 7/10 | 6/10 |
| 9 | Scalability + query optimization | 7/10 | 9/10 | 8/10 |
| 10 | Cloud deployment (AWS + Terraform) | 7/10 | 8/10 | 9/10 |

---

## Milestone Roadmap

### M1 — Solid Backend Foundation
**Phases:** 1 + 2
**Goal:** Code is structured correctly. DB is relational with proper constraints. Any engineer can clone and run locally.
**Exit criteria:**
- Schema enforces referential integrity
- No business logic in controllers
- `docker compose up` gives a working app

### M2 — Production-Safe
**Phases:** 3 + 4
**Goal:** Application cannot be trivially exploited.
**Exit criteria:**
- OTP reset flow is server-enforced
- Invite flow uses cryptographic tokens
- Rate limiting active on auth endpoints
- JWT blocklist working on logout

### M3 — Provably Correct
**Phases:** 5 + 6
**Goal:** Business logic is tested. CI enforces it on every PR.
**Exit criteria:**
- Balance calculation has 8+ test cases
- CI blocks merges on failing tests
- Coverage ≥ 80% on `services/`

### M4 — Observable and Complete
**Phases:** 7 + 8
**Goal:** You can debug production issues. Product is feature-complete.
**Exit criteria:**
- Every error captured by Sentry with context
- Settlements persist to database
- Real-time balance updates via WebSocket

### M5 — Production
**Phases:** 9 + 10
**Goal:** Running on real infrastructure. Scalable. Cost-controlled.
**Exit criteria:**
- On AWS, Terraform-managed
- No sequential scans on large tables
- CloudWatch alarms configured

---

## 3-Month Plan (~10 hrs/week)

```
Month 1
  Week 1–2   Phase 1 — PostgreSQL migration + schema design
  Week 3     Phase 2 — Docker + local dev
  Week 4     Phase 3 — Security (OTP fix, invite fix, RBAC)

Month 2
  Week 5     Phase 4 — Redis (OTP storage, balance cache, JWT blocklist)
  Week 6–7   Phase 5 — Testing (balance unit tests + integration tests)
  Week 8     Phase 6 — CI/CD pipeline

Month 3
  Week 9     Phase 7 — Observability (logging, health, Sentry)
  Week 10    Phase 8 partial — Settlements + audit log
  Week 11    Phase 9 — Indexes + pagination
  Week 12    Phase 10 partial — Deploy to Railway/Render with Terraform
```

---

## 6-Month Plan

```
Months 1–3   Everything in the 3-month plan

Month 4
  Complete Phase 8 (all features including WebSockets)
  Write a blog post: "How I redesigned SplitIt's database schema"
  Add EXPLAIN ANALYZE output to docs/

Month 5
  Full Phase 10 — AWS deployment with Terraform
  Configure CloudWatch monitoring and alerting
  Load test with k6 — find one bottleneck, fix it, document it

Month 6
  Architecture diagram in README
  Record a 5-minute demo video
  Write ADRs for every major decision made
  Use the project as interview material
```

---

## Minimum Work for Maximum Resume Impact

Do exactly these, in order, if time is limited:

1. **PostgreSQL migration + schema design** (Phase 1)
   One resume line → 20-minute interview conversation about data modeling and ACID.

2. **Repository / Service architecture** (Phase 1)
   Shows you understand separation of concerns. Every senior engineer discusses this.

3. **Docker + docker-compose** (Phase 2)
   Reviewers run these. A working `docker compose up` signals professionalism.

4. **Balance calculation tests** (Phase 5)
   8 tests proving core business logic is correct. More signal than 200 trivial tests.

5. **CI/CD pipeline** (Phase 6)
   A passing badge in the README. Shows automated quality gates exist.

6. **Health endpoint + structured logging** (Phase 7)
   Two files. Shows you think about what happens after you deploy.

**Estimated time:** 3–4 weeks of focused work.

---

## What Impresses Senior Engineers Most

In order of actual impressiveness to a 10-year engineer:

1. **ADRs for every major decision** — Documents *why*, not just *what*. Rare skill.
2. **Business logic tests that prove correctness** — Not HTTP status code tests. Real invariant tests.
3. **Transaction boundaries with audit logs** — Shows ACID understanding for financial data.
4. **Finding and fixing your own security bugs** — The git commit message matters. Shows judgment.
5. **Cursor-based pagination with written justification** — The understanding, not just the code.
6. **EXPLAIN ANALYZE output committed to the repo** — Uncommon. Very uncommon.

**What does NOT impress them:**
Adding more features. Microservices on a side project. GraphQL for the resume line.
Any technology choice made to add a bullet point rather than solve a problem.

---

## Core Principle

> Every decision you make should be one you can defend
> in a 45-minute system design interview.
> If you can't explain *why*, the resume line is worthless.
