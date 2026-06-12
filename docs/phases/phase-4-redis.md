# Phase 4 — Redis Integration

**Difficulty:** 5/10 | **Engineering Value:** 8/10 | **Resume Value:** 8/10

---

## Goal

Integrate Redis for five concrete use cases, each solving a specific problem.
Understanding *why* each use case exists is more important than the implementation.

---

## Why It Matters

Redis is in every production backend. The interview question is not "do you know
Redis?" — it is "tell me about a specific problem you solved with Redis and why
Redis was the right tool." Every use case here has that answer.

---

## What It Teaches

- Cache-aside pattern (read-through caching)
- TTL-based expiry for ephemeral data
- Redis as a coordination primitive across server instances
- The difference between Redis as a cache vs. Redis as a data store
- When caching makes things worse (cache invalidation)

---

## Use Cases

### 1. OTP Storage (prerequisite for Phase 3)

**Problem:** OTPs stored in the user document are permanent, queryable, and in plaintext.

**Solution:** Store hashed OTP in Redis with TTL.

```javascript
// Generate and store
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const otp = String(Math.floor(100000 + crypto.randomInt(900000))); // crypto, not Math.random
const hashed = await bcrypt.hash(otp, 10);
await redis.setEx(`otp:${email}`, 600, hashed); // expires in 10 minutes

// Verify (constant-time)
const stored = await redis.get(`otp:${email}`);
if (!stored) return res.status(400).json({ error: 'OTP expired or not requested' });
const valid = await bcrypt.compare(submittedOtp, stored);
```

**Why Redis and not DB:** OTPs are ephemeral. Storing them in the DB adds a column
to the users table for temporary data with no business meaning. Redis TTL handles
expiry automatically — no cron job needed to clean up stale OTPs.

---

### 2. Balance Calculation Cache

**Problem:** The balance calculation in `expense.controller.js` scans every expense
in a group on every page load. Fine at 10 expenses. Slow at 10,000.

**Pattern:** Cache-aside. Read from cache, compute on miss, invalidate on write.

```javascript
// In balance.service.js
async function getGroupBalances(groupId) {
  const cacheKey = `balances:${groupId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const balances = await calculateBalances(groupId); // expensive query
  await redis.setEx(cacheKey, 300, JSON.stringify(balances)); // 5-minute TTL
  return balances;
}

// Invalidate whenever the balance could change:
async function invalidateBalanceCache(groupId) {
  await redis.del(`balances:${groupId}`);
}

// Call invalidateBalanceCache after:
// - expense created
// - expense deleted
// - expense edited
// - settlement recorded
```

**The hard part — cache invalidation:** You must call `invalidateBalanceCache`
everywhere the balance can change. Missing one place means stale data. This is
why "cache invalidation is one of the two hard things in computer science."

---

### 3. JWT Blocklist

**Problem:** JWT tokens are stateless — they remain valid until expiry even after
logout or password change.

**Solution:** Maintain a blocklist in Redis. Token TTL matches remaining token validity.

```javascript
// Add jti claim when generating tokens:
const jti = crypto.randomUUID();
const token = jwt.sign({ userId, jti }, JWT_SECRET, { expiresIn: '10d' });

// Block on logout:
async function blockToken(token) {
  const decoded = jwt.decode(token);
  const remainingTtl = decoded.exp - Math.floor(Date.now() / 1000);
  if (remainingTtl > 0) {
    await redis.setEx(`blocklist:${decoded.jti}`, remainingTtl, '1');
  }
}

// Check in verifyJWT middleware:
const blocked = await redis.get(`blocklist:${decoded.jti}`);
if (blocked) return res.status(401).json({ error: 'Token revoked' });
```

**Why Redis and not DB:** The blocklist entry only needs to exist until the token
naturally expires. After that, the JWT signature check handles rejection. Redis TTL
handles the cleanup automatically.

---

### 4. Rate Limiting

**Problem:** In-memory rate limiting resets on restart, does not work across
multiple server instances.

**Solution:** Redis-backed rate limiting — see Phase 3 implementation.

**Key point for interviews:** "My rate limiter uses Redis so it works correctly
across multiple backend instances behind a load balancer. If I used in-memory, each
instance would have an independent counter, meaning an attacker could bypass the
limit by round-robin across instances."

---

### 5. Invite Intent (Session State)

**Problem:** An unauthenticated user clicks an invite link, needs to register first,
then must be added to the correct group after registration. How do you preserve this
intent across the registration flow?

**Solution:** Store intent in Redis keyed by a short-lived session ID.

```javascript
// When invite link is visited (user not logged in):
const sessionId = crypto.randomUUID();
await redis.setEx(
  `invite_intent:${sessionId}`,
  3600,
  JSON.stringify({ token: inviteToken, groupId })
);
// Return sessionId as a cookie or query param

// After successful registration:
const intent = await redis.get(`invite_intent:${req.sessionId}`);
if (intent) {
  const { token } = JSON.parse(intent);
  await invitationService.accept(token, newUser.id);
  await redis.del(`invite_intent:${req.sessionId}`);
}
```

---

## Redis Key Naming Convention

Use a consistent namespace pattern: `<namespace>:<identifier>`

```
otp:<email>                    → OTP for password reset
balances:<groupId>             → Cached balance calculation
blocklist:<jti>                → Revoked JWT token
rate_limit:<ip>:<endpoint>     → Rate limit counter (managed by library)
invite_intent:<sessionId>      → Pending invite session
reset_token:<jti>              → Single-use password reset token
```

---

## Graceful Degradation

Redis failure should not take down the application for most operations.

```javascript
// Balance cache — safe to fall through to DB on Redis failure
async function getGroupBalances(groupId) {
  try {
    const cached = await redis.get(`balances:${groupId}`);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    logger.warn({ err }, 'Redis unavailable — falling back to DB for balance calculation');
  }
  return calculateBalances(groupId); // always works without cache
}

// Rate limiting and JWT blocklist — Redis failure here is a security tradeoff.
// Decision: fail open (allow request) on Redis failure, but log it as an alert.
// Rationale: availability > strict rate limiting for a non-financial auth endpoint.
// Document this decision in ADR.
```

---

## Acceptance Criteria

- [ ] OTPs stored hashed in Redis with 10-min TTL — not in the `users` table
- [ ] Balance calculations cached per group — verified by checking Redis after API call
- [ ] Balance cache invalidated on expense create, delete, edit, and settlement create
- [ ] JWT blocklist active — logging out makes the token rejected on next request
- [ ] Rate limiting backed by Redis — verified by running two server instances
- [ ] Redis connection failure logs a warning but does not crash the server
- [ ] All Redis keys follow the `<namespace>:<identifier>` naming convention

---

## Interview Discussion Points

- "What is the cache-aside pattern?"
- "How do you handle cache invalidation when an expense is deleted?"
- "Why does your rate limiter use Redis and not in-memory?"
- "What is a JWT blocklist and why do you need it if JWT is stateless?"
- "What happens if Redis goes down — does your application stop working?"
