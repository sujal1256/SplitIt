# Phase 1 — Architecture Redesign

**Difficulty:** 8/10 | **Engineering Value:** 10/10 | **Resume Value:** 9/10

---

## Goal

Migrate from MongoDB to PostgreSQL, redesign the schema with proper relational
integrity, and introduce a layered architecture (Repository → Service → Controller).

---

## Why It Matters

Expense splitting is a relational problem. Every entity — users, groups, memberships,
expenses, participants, settlements — has strict referential relationships that must
not be violated. MongoDB's document model allows partial writes and orphaned data.
PostgreSQL's FK constraints, ACID transactions, and NUMERIC type make it the correct
tool for financial data.

The layered architecture ensures each file has exactly one responsibility. You will
use this pattern at every company you work at.

---

## What It Teaches

- Relational data modeling for a financial domain
- Database normalization (1NF, 2NF, 3NF — know the names)
- FK constraints and what happens when you violate them
- ACID transactions and why money requires them
- `NUMERIC` vs `FLOAT` — never store money as a float (rounding errors are real)
- Migration management as a discipline
- The Repository pattern and why the service layer must not touch SQL
- The difference between embedding (Mongo) and referencing (SQL) and when each is right

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone         VARCHAR(20),
    is_active     BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Groups
CREATE TABLE groups (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Group Memberships
CREATE TABLE group_members (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id  UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role      VARCHAR(20) NOT NULL DEFAULT 'member'
                  CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Expenses
CREATE TABLE expenses (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id     UUID NOT NULL REFERENCES groups(id) ON DELETE RESTRICT,
    paid_by      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title        VARCHAR(255) NOT NULL,
    amount       NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    split_type   VARCHAR(20) NOT NULL DEFAULT 'equal'
                     CHECK (split_type IN ('equal', 'exact', 'percentage')),
    notes        TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_by   UUID NOT NULL REFERENCES users(id),
    deleted_at   TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expense Participants
CREATE TABLE expense_participants (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id  UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount_owed NUMERIC(12, 2) NOT NULL CHECK (amount_owed >= 0),
    UNIQUE(expense_id, user_id)
);

-- Settlements
CREATE TABLE settlements (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id   UUID NOT NULL REFERENCES groups(id) ON DELETE RESTRICT,
    paid_by    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    paid_to    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount     NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    note       TEXT,
    settled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (paid_by != paid_to)
);

-- Invitations
CREATE TABLE invitations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id    UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    invited_by  UUID NOT NULL REFERENCES users(id),
    email       VARCHAR(255) NOT NULL,
    token       VARCHAR(255) NOT NULL UNIQUE,
    status      VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
    expires_at  TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Logs (append-only — never UPDATE or DELETE)
CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id    UUID REFERENCES users(id),
    action      VARCHAR(100) NOT NULL,
    resource    VARCHAR(100) NOT NULL,
    resource_id UUID,
    payload     JSONB,
    ip_address  INET,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Key Design Decisions (know these for interviews)

| Decision | Reason |
|---|---|
| `NUMERIC(12,2)` not `FLOAT` | Floats have rounding errors. Never store money as float. |
| `UUID` primary keys | Avoids enumeration attacks. Safe for distributed systems. |
| `deleted_at` on expenses | Soft delete. Financial records must not be hard-deleted. |
| `expense_participants` table | Supports equal, exact, and percentage splits. |
| `UNIQUE(group_id, user_id)` | DB-enforced, not application-enforced. |
| `settlements` as first-class entity | Not derived or calculated — a recorded event. |
| Audit log append-only | Security and compliance pattern. |
| `ON DELETE RESTRICT` on expenses | You cannot delete a user who has paid for expenses. |
| `ON DELETE CASCADE` on group_members | Deleting a group removes its memberships. |

---

## Migration Files

Use `node-pg-migrate`. Every file is numbered and named.

```
server/migrations/
  001_create_users.sql
  002_create_groups.sql
  003_create_group_members.sql
  004_create_expenses.sql
  005_create_expense_participants.sql
  006_create_settlements.sql
  007_create_invitations.sql
  008_create_audit_logs.sql
  009_add_indexes.sql
```

Rules:
- Never run migrations in application startup
- Migrations run as a separate process before deployment
- `down` migrations exist for local dev only — never run in production

---

## Layered Architecture

```
src/
  repositories/     ← Raw SQL queries only. No business logic.
    user.repository.js
    group.repository.js
    expense.repository.js
    settlement.repository.js
    invitation.repository.js
  services/          ← Business logic, orchestration, transactions
    user.service.js
    group.service.js
    expense.service.js
    balance.service.js
    invitation.service.js
  controllers/       ← HTTP only: parse request → call service → format response
    user.controller.js
    group.controller.js
    expense.controller.js
    settlement.controller.js
```

### Layer Rules (enforce strictly)

**Repository:** Takes primitive arguments, returns plain objects. No business logic.
No calls to other repositories. No HTTP concepts.

**Service:** Orchestrates repositories. Contains all business rules. Owns transaction
boundaries. No SQL strings. No HTTP concepts (no req/res).

**Controller:** Parse request → validate → call ONE service method → return response.
Should be under 20 lines per endpoint.

---

## Acceptance Criteria

- [ ] All data migrated from MongoDB to PostgreSQL with zero data loss
- [ ] All existing API endpoints work identically after migration
- [ ] FK constraints tested — inserting orphaned data fails at DB level
- [ ] `NUMERIC` used for all monetary values — no `FLOAT` or `Number` for money
- [ ] Migration files committed and runnable from empty DB in order
- [ ] Seed script creates: 3 users, 2 groups, 10 expenses, 2 settlements
- [ ] Repository layer has no business logic
- [ ] Service layer has no SQL strings
- [ ] Controller layer has no SQL or business logic
- [ ] ADR-001 written and committed

---

## Interview Discussion Points

- "Why PostgreSQL over MongoDB for this domain?" — relational data, ACID, FK constraints
- "Why `NUMERIC` and not `Number`?" — floating point precision errors in money
- "What does `ON DELETE RESTRICT` vs `CASCADE` mean and when do you choose each?"
- "What is the Repository pattern and why does it exist?"
- "Where do database transactions live in your architecture?"
- "What is a soft delete and when is it appropriate?"
