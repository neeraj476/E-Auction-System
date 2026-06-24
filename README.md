# E-Auction System

A microservices-based online auction platform built with Node.js, Express, and MySQL. Each service is independently deployable, owns its own database, and communicates with the others over HTTP using a shared JWT for authentication.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────────┐
│   auth-service   │     │  auction-service  │     │ notification-service│
│   (port 8000)    │     │   (port 8001)     │     │    (port 8002)      │
│                  │     │                    │     │                      │
│   auth_db        │     │   auction_db       │     │    (stateless)       │
└─────────────────┘     └──────────────────┘     └────────────────────┘
```

Services are decoupled and verify identity using a **shared JWT secret** — `auth-service` issues tokens on login/register, and the other services verify them without needing direct access to `auth_db`.

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express
- **Database:** MySQL (via `mysql2/promise`, connection pooling)
- **Auth:** JWT (`jsonwebtoken`), `bcrypt` for password hashing, httpOnly cookies
- **Scheduling:** `node-cron`
- **Email:** Nodemailer (SMTP)
- **Env management:** `dotenv`

## Services

### 1. `auth-service` — ✅ Complete

Handles user registration, login, and session management.

| Method | Endpoint | Auth required | Description |
|--------|----------|---------------|--------------|
| POST | `/api/auth/register` | No | Create account, auto-login (sets JWT cookie) |
| POST | `/api/auth/login` | No | Verify credentials, set JWT cookie |
| POST | `/api/auth/logout` | No | Clear JWT cookie |
| GET | `/api/auth/me` | Yes | Get current user's profile |

**Key implementation details:**
- Passwords hashed with `bcrypt` before storage — never stored or compared in plain text
- JWT delivered as an `httpOnly`, `sameSite=strict` cookie (not exposed to client-side JS)
- Generic "Invalid email or password" error on login failures (doesn't leak which emails are registered)

---

### 2. `auction-service` — ✅ Complete

Handles auction listings and bidding.

| Method | Endpoint | Auth required | Description |
|--------|----------|---------------|--------------|
| POST | `/api/auctions` | Yes | Create a new auction (seller only) |
| GET | `/api/auctions` | No | List all active auctions |
| GET | `/api/auctions/:id` | No | Get one auction's details |
| PUT | `/api/auctions/:id` | Yes (owner only) | Update title/description |
| DELETE | `/api/auctions/:id` | Yes (owner only) | Cancel an auction |
| POST | `/api/auctions/:auctionId/bids` | Yes | Place a bid |
| GET | `/api/auctions/:auctionId/bids` | No | List all bids on an auction |

**Key implementation details:**
- Bid validation: new bid must exceed `current_price` **and** meet a configurable minimum increment (`MIN_BID_INCREMENT`)
- Sellers cannot bid on their own auctions
- Only the auction's creator can update or cancel it; cannot modify a `closed`/`cancelled` auction
- **`auctionScheduler.js`** — a `node-cron` job runs every minute, automatically closing any `active` auction whose `end_time` has passed and determining the winning bid

---

### 3. `notification-service` — 🚧 In Progress

Stateless email notifications for auction events (winner/seller alerts, outbid alerts).

| Method | Endpoint | Auth required | Description |
|--------|----------|---------------|--------------|
| POST | `/api/notifications/auction-ended` | Internal API key | Emails winner + seller when an auction closes |
| POST | `/api/notifications/outbid` | Internal API key | Emails a bidder who's been outbid |

**Key implementation details:**
- No database — receives a request, sends an email via Nodemailer (SMTP), done
- Protected by a shared `INTERNAL_API_KEY` header rather than user JWTs, since it's only ever called service-to-service, not by end users directly

**Still to do:**
- Wire `auction-service` to actually call this service when an auction ends or a bid is outbid (requires resolving a `seller_id`/`bidder_id` into an email address, since `auction_db` only stores user IDs, not emails)

## Planned / Not Yet Built

- [ ] Complete the `auction-service` → `notification-service` integration
- [ ] Payment service (handle payment from the winning bidder)
- [ ] API Gateway (single entry point routing requests to the right service)
- [ ] Event-driven messaging via RabbitMQ (currently using direct HTTP calls between services instead)
- [ ] Frontend client

## Project Structure

```
E-Auction-System/
├── server/
│   ├── auth-service/
│   │   ├── src/
│   │   │   ├── controllers/authController.js
│   │   │   ├── routes/authRoutes.js
│   │   │   ├── models/userModel.js
│   │   │   ├── middleware/verifyToken.js
│   │   │   └── config/{db.js, env.js}
│   │   ├── .env
│   │   ├── package.json
│   │   └── server.js
│   │
│   ├── auction-service/
│   │   ├── src/
│   │   │   ├── controllers/{auctionController.js, bidController.js}
│   │   │   ├── routes/{auctionRoutes.js, bidRoutes.js}
│   │   │   ├── models/{auctionModel.js, bidModel.js}
│   │   │   ├── middleware/authMiddleware.js
│   │   │   ├── jobs/auctionScheduler.js
│   │   │   └── config/{db.js, env.js}
│   │   ├── .env
│   │   ├── package.json
│   │   └── server.js
│   │
│   └── notification-service/
│       ├── src/
│       │   ├── controllers/notificationController.js
│       │   ├── routes/notificationRoutes.js
│       │   ├── middleware/internalAuth.js
│       │   ├── utils/mailer.js
│       │   └── config/env.js
│       ├── .env
│       ├── package.json
│       └── server.js
│
└── .gitignore
```

## Setup

Each service runs independently with its own `package.json` and `.env`.

```bash
# For each service folder (auth-service, auction-service, notification-service):
cd server/<service-name>
npm install
npm run dev   # or: node server.js
```

### Required environment variables

**`auth-service/.env`**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=auth_db
PORT=8000
JWT_SECRET=
```

**`auction-service/.env`**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=auction_db
PORT=8001
JWT_SECRET=        # must match auth-service exactly
MIN_BID_INCREMENT=1.00
```
notification-service
**`notification-service/.env`**

PORT=8002
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
INTERNAL_API_KEY=  # must match whatever auction-service uses to call this service


