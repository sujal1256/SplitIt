# Phase 3 — Security Hardening

**Difficulty:** 6/10 | **Engineering Value:** 10/10 | **Resume Value:** 9/10

---

## Goal

Close all critical security vulnerabilities in the current application. Establish
secure patterns for auth, invitations, authorization, and input handling that will
hold under a real security review.

---

## Why It Matters

The current application has multiple vulnerabilities that would fail a basic security
audit. Security is not a feature added later — it is a foundation. Every senior
engineer is expected to identify and fix these patterns without being asked.

---

## Current Vulnerabilities (from code review)

| Issue | Severity | Location |
|---|---|---|
| Password reset has no server-side auth check | Critical | `user.controller.js:handleResetPassword` |
| OTP stored in plaintext on user document, never cleared | Critical | `user.model.js` |
| `/store-invited-user` is public — anyone can create accounts | Critical | `group.route.js` |
| Invited users get hardcoded password `"default"` | Critical | `group.controller.js:storeInvitedUser` |
| Login response sends full user doc including password hash | High | `user.controller.js:handleLogin` |
| `console.log(req.body)` logs plaintext passwords | High | `user.controller.js:handleRegister` |
| JWT cookie missing `secure: true` | High | `user.controller.js:handleLogin` |
| Any member can delete any expense (no ownership check) | High | `expense.route.js` |

---

## Fix 1: Password Reset Flow

**Current (broken):** OTP verified client-side. `/reset-password` accepts requests
with just an email — no proof of OTP verification required.

**Correct flow:**

```
POST /auth/forgot-password
  → generate 6-digit OTP using crypto (not Math.random)
  → hash the OTP with bcrypt
  → store in Redis: key="otp:<email>", value=<hashed OTP>, TTL=600s (10 min)
  → send OTP email
  → return 200 with no useful data to caller

POST /auth/verify-otp
  → fetch hashed OTP from Redis by email
  → compare using bcrypt.compare (constant-time — prevents timing attacks)
  → if valid: generate signed reset token (JWT, 15-min expiry, includes jti)
  → store token jti in Redis: key="reset_token:<jti>", TTL=900s
  → delete OTP from Redis (single-use)
  → return reset token to client

POST /auth/reset-password
  → require reset token in Authorization header
  → verify JWT signature and expiry
  → check jti exists in Redis (not already used)
  → delete jti from Redis (single-use enforcement)
  → hash new password and update user
  → add all existing access tokens to JWT blocklist (force re-login)
  → return 200
```

**Why `crypto.timingSafeEqual` / `bcrypt.compare` for OTP:**
String equality in JS short-circuits on first mismatch, which leaks timing information.
Timing attacks against OTP systems are real. Always use constant-time comparison.

---

## Fix 2: Invite Flow

**Current (broken):** `/store-invited-user` is a public endpoint. Anyone can POST
to it and create arbitrary accounts. Invited users get password `"default"`.

**Correct flow:**

```
POST /groups/:id/invitations        (authenticated, admin role required)
  → validate email format
  → check user is not already a member
  → generate token: crypto.randomBytes(32).toString('hex')
  → insert into invitations table: token, group_id, email, expires_at=NOW()+7days
  → send email with link: FRONTEND_URL/invite?token=<token>
  → return 200

GET /invitations/:token             (public — safe to expose)
  → look up token in invitations table
  → verify status='pending' and expires_at > NOW()
  → return: group name, invited by name, email
  → do NOT return the token's internal ID or sensitive data

POST /invitations/:token/accept     (public, token-gated)
  → verify token exists, is pending, not expired
  → if user already registered: require JWT auth, add to group
  → if not registered: require { name, password } in body, create account, add to group
  → update invitation: status='accepted', accepted_at=NOW()
  → token is now invalid for any further use
```

The token IS the authorization. There is no need for a separate auth mechanism.

---

## Fix 3: RBAC Middleware

```javascript
// src/middlewares/requireGroupPermission.js

const PERMISSIONS = {
  'expense:create':    ['admin', 'member'],
  'expense:delete':    ['admin'],
  'expense:edit':      ['admin'],
  'group:delete':      ['admin'],
  'group:invite':      ['admin'],
  'member:remove':     ['admin'],
  'settlement:create': ['admin', 'member'],
};

export function requireGroupPermission(permission) {
  return async (req, res, next) => {
    const groupId = req.params.groupId || req.body.groupId || req.query.groupId;
    const membership = await groupMemberRepository.find(groupId, req.user.id);

    if (!membership) {
      return res.status(403).json({ error: 'Not a group member' });
    }
    if (!PERMISSIONS[permission]?.includes(membership.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    req.membership = membership;
    next();
  };
}

// Applied on routes:
router.delete(
  '/groups/:groupId/expenses/:id',
  verifyJWT,
  requireGroupPermission('expense:delete'),
  expenseController.delete
);
```

---

## Fix 4: Input Validation with Zod

Every request body and query param gets a Zod schema. The middleware coerces and
strips unknown fields before the request reaches the controller.

```javascript
// src/middlewares/validate.js
import { z } from 'zod';

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten()
      });
    }
    req.body = result.data; // use parsed/coerced data, not raw input
    next();
  };
}

// Example schema:
export const createExpenseSchema = z.object({
  title:           z.string().min(1).max(255),
  amount:          z.number().positive().multipleOf(0.01),
  split_type:      z.enum(['equal', 'exact', 'percentage']),
  participant_ids: z.array(z.string().uuid()).min(1),
  expense_date:    z.string().date().optional(),
  notes:           z.string().max(1000).optional(),
});
```

---

## Fix 5: Security Headers

```javascript
import helmet from 'helmet';

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc:  ["'self'"],
    styleSrc:   ["'self'", "'unsafe-inline'"],
    imgSrc:     ["'self'", "data:"],
  }
}));
```

---

## Fix 6: Rate Limiting (Redis-backed)

```javascript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// Strict limit for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,
  store: new RedisStore({ client: redis }),
  message: { error: 'Too many attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limit
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  store: new RedisStore({ client: redis }),
});

app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', apiLimiter);
```

**Why Redis-backed and not in-memory:** In-memory rate limiting resets on every
server restart, does not work across multiple server instances, and can be bypassed
by timing restarts. Redis survives restarts and is shared across all instances.

---

## Fix 7: JWT Blocklist

JWT tokens are stateless — valid until expiry regardless of logout. This is a
real security gap: a stolen token remains valid until it expires.

```javascript
// On token generation — add jti claim:
const jti = crypto.randomUUID();
const token = jwt.sign({ userId, jti }, JWT_SECRET, { expiresIn: '10d' });

// On logout or password change:
const decoded = jwt.decode(token);
const ttl = decoded.exp - Math.floor(Date.now() / 1000);
await redis.setEx(`blocklist:${decoded.jti}`, ttl, '1');

// In verifyJWT middleware — add this check:
const blocked = await redis.get(`blocklist:${decoded.jti}`);
if (blocked) return res.status(401).json({ error: 'Token has been revoked' });
```

---

## Fix 8: Remove console.log from Production

Replace with structured logger (Pino — covered in Phase 7). For now, just delete them.
The ones in `handleRegister` and `handleLogin` are logging plaintext passwords.

---

## Acceptance Criteria

- [ ] Password reset requires OTP verified server-side before reset token issued
- [ ] Reset token is single-use and expires in 15 minutes
- [ ] OTP stored hashed in Redis with 10-minute TTL — not in the database
- [ ] No user account creatable via unauthenticated endpoint
- [ ] All invite tokens use `crypto.randomBytes(32)` — no Math.random
- [ ] Invited users set their own password — no default passwords exist anywhere
- [ ] Every data-modifying route checks group membership and role via RBAC middleware
- [ ] All request bodies validated with Zod — unknown fields stripped
- [ ] Helmet applied with CSP headers
- [ ] Auth endpoints rate-limited via Redis
- [ ] JWT blocklist active — logout actually invalidates the token
- [ ] Login response does NOT include `password_hash`
- [ ] Zero `console.log` in production code paths

---

## Interview Discussion Points

- "Walk me through your password reset flow." — can you describe it end to end?
- "What is a timing attack and how does it apply to OTP verification?"
- "What is RBAC and how did you implement it?"
- "Why does JWT logout need a blocklist if JWT is stateless?"
- "Why is in-memory rate limiting insufficient for production?"
- "What is the difference between authentication and authorization?"
