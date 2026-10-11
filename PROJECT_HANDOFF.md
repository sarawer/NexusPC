# NexusPC Project Handoff

This document is the canonical handoff guide for agents and developers working on
NexusPC. Read it before changing code, infrastructure, API contracts, database
behavior, authentication, or deployment configuration.

## 1. Product overview

NexusPC is a Bangladesh-focused PC parts and accessories e-commerce application.
Customers can browse products, search/filter the catalog, register and log in,
manage a cart and wishlist, manage delivery addresses, place COD orders, review
products, and use a PC Builder. Administrators can manage catalog data, inventory,
orders, reviews, uploads, dashboard data, and user roles.

The frontend is a Next.js application and the backend is a stateless Spring Boot
REST API. The backend owns authentication, authorization, prices, stock,
checkout calculations, order creation, and persistence. The browser must never be
treated as authoritative for prices, stock, discounts, or permissions.

## 2. Current production deployment

| Part | Current platform | Address / deployment detail |
|---|---|---|
| Frontend | Vercel | `https://nexuspc.sarawer.me` |
| Alternate frontend domain | Vercel | `https://nexus-pc-w3q3.vercel.app` |
| Backend | Render free web service | `https://nexuspc-backend.onrender.com` |
| Backend deployment | Docker | `backend/Dockerfile`, Java 21 runtime |
| Database | Azure Database for MySQL Flexible Server | Host: `nexuspc.mysql.database.azure.com`, port `3306`, SSL required |
| Images | Cloudinary | Credentials are stored only in hosting environment variables |
| Payments | COD active; bKash disabled | Do not enable bKash without completing callback and verification work |
| Previous database | Aiven MySQL | No longer the active database; do not assume it contains current data |

The production database is a newly created Azure MySQL database. Default categories
are seeded on backend startup. Product, user, order, and other application data
must be treated as Azure data.

The current low-cost deployment is functional, but Render free resources and
cross-service network latency can make uncached pages and database-backed API
requests slow. Do not promise low latency without measuring the endpoint.

## 3. Repository layout

```text
.
├── src/                         Next.js frontend
│   ├── app/                     App Router pages and route layouts
│   ├── components/              Reusable UI components
│   ├── data/                   Static fallback/mock catalog data
│   ├── lib/
│   │   ├── api.ts              Shared fetch wrapper and JWT header handling
│   │   └── services/           Frontend API service modules
│   ├── store/                  Zustand client state (cart and related state)
│   ├── types/                  Shared frontend TypeScript types
│   └── ...
├── backend/
│   ├── pom.xml                 Maven/Spring Boot build
│   ├── mvnw                    Maven Wrapper
│   ├── Dockerfile              Render production image build
│   └── src/main/java/com/nexuspc/
│       ├── auth/               Registration, login, JWT, current-user APIs
│       ├── user/               User entity, role, repository
│       ├── catalog/            Categories, products, image upload
│       ├── cart/               Cart and wishlist
│       ├── address/            Saved shipping addresses
│       ├── order/              Customer and admin order flows
│       ├── review/             Reviews and moderation
│       ├── builder/            PC Builder validation and saved builds
│       ├── admin/              Dashboard, inventory, users
│       ├── payment/            bKash boundary (disabled)
│       ├── config/             Security, CORS, persistence wiring
│       └── exception/          API error mapping
├── render.yaml                 Render Docker service and environment declarations
├── .env.example                Secret-free variable reference
├── AGENTS.md                   Next.js-specific agent instruction
└── PROJECT_HANDOFF.md          This document
```

Do not edit `backend/target/`; it is generated build output. Do not commit
`.env`, `.env.local`, passwords, JWT secrets, database exports, or Cloudinary
credentials.

## 4. Technology stack

### Frontend

- Next.js `16.3.8`, App Router, React Server Components where applicable
- React `19.2.8`
- TypeScript 5
- Tailwind CSS 4
- Lucide React icons
- Zustand 5 with persistence for client state
- `fetch` through `src/lib/api.ts`
- Vercel production deployment

This repository contains a generated Next.js agent instruction in `AGENTS.md`.
Before changing Next.js behavior, read the relevant documentation under the
installed `node_modules/next/dist/docs/` directory when dependencies are
available.

### Backend

- Java 21
- Spring Boot `3.3.5`
- Spring MVC REST controllers
- Spring Data JPA / Hibernate
- Spring Security 6
- BCrypt password hashing
- Stateless JWT authentication using JJWT `0.12.6`
- MySQL Connector/J
- H2 runtime dependency for local/in-memory fallback when explicitly configured
- Bean Validation
- Cloudinary Java client
- Spring Boot Actuator health endpoint
- Maven Wrapper

### Infrastructure

- Vercel: frontend build and hosting
- Render: Dockerized Spring Boot backend
- Azure Database for MySQL Flexible Server: persistent production database
- Cloudinary: product image storage and delivery
- UptimeRobot: health endpoint monitoring/warm-up may be used, but it does not
  replace performance optimization

## 5. Backend layering and coding conventions

Most backend domains use this structure:

```text
Controller → Service → Repository → JPA Entity
                 ↓
                DTO
```

- Controllers should remain thin: validate input, obtain the authenticated
  principal, call a service, and return a DTO.
- Business rules belong in services.
- Repositories contain persistence queries.
- Do not expose `User`, `Product`, `Order`, or other entities directly from new
  public APIs; use response DTOs.
- Use `@Transactional` for mutations and checkout/stock operations.
- Use `@Transactional(readOnly = true)` for read-only service methods.
- Throw the existing domain-appropriate exceptions and let
  `GlobalExceptionHandler` produce the API error response.
- Preserve existing JSON field names because the frontend services depend on them.
- Keep Java code beginner-friendly and consistent with the existing compact style
  unless a touched file is being cleanly reformatted.

## 6. Authentication and authorization

### Registration and login

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/me
```

Registration creates a `CUSTOMER`. Passwords are encoded with BCrypt and never
stored or returned in plain text. Login returns a JWT and public user data.

The frontend stores the JWT in browser local storage under the token key used by
`src/lib/api.ts`. `apiFetch()` attaches:

```text
Authorization: Bearer <token>
```

The backend validates the JWT in `JwtAuthenticationFilter`. The security chain is
stateless. Public routes include registration, login, catalog reads, bKash
callback boundary, uploads/static resources where configured, errors, and
`/actuator/health`; all other routes require authentication unless a method-level
rule applies.

### Roles

`UserRole` contains `CUSTOMER`, `ADMIN`, and `SUPER_ADMIN`. Admin controllers allow
both admin roles; only `SUPER_ADMIN` can change a customer's or admin's role.
Super-admin accounts cannot be changed from the admin panel. Never rely only on
frontend route hiding for authorization.

### Admin user management

```text
GET  /api/admin/customers
PUT  /api/admin/customers/{id}/role (SUPER_ADMIN only)
```

The role change request includes the target role (`CUSTOMER` or `ADMIN`) and the
current super-admin password. The backend verifies the password with BCrypt and
never permits creating or changing a `SUPER_ADMIN` account through this endpoint.

Never implement password verification in the browser and never return password
hashes in DTOs.

## 7. API surface

All paths below are relative to `https://nexuspc-backend.onrender.com` in
production and `http://localhost:8080` locally.

### Public catalog

```text
GET /api/categories
GET /api/categories/{slug}
GET /api/products
GET /api/products/{slug}
GET /api/products/slug/{slug}
GET /api/products/featured
GET /api/products/bestsellers
GET /api/products/new
GET /api/products/{slug}/reviews
```

Product search supports `q`, `category`, `brand`, `minPrice`, `maxPrice`,
`featured`, `bestseller`, `new`, `page`, `size`, and `sort`.

### Authenticated customer APIs

```text
GET/POST/PUT/DELETE /api/cart...
GET/POST/DELETE      /api/wishlist...
GET/POST/PUT/DELETE /api/addresses...
POST                 /api/orders
GET                  /api/orders
GET                  /api/orders/{id}
POST                 /api/orders/{id}/cancel
GET/POST/PUT/DELETE  /api/products/{slug}/reviews and /api/reviews/{id}
POST                 /api/pc-builder/validate
GET/POST/DELETE      /api/pc-builder/builds...
```

Cart and order prices are loaded from the database. Checkout validates stock,
calculates delivery/totals server-side, decrements stock transactionally, and
clears the cart. Customer queries must remain owner-scoped by the authenticated
email/user.

### Admin APIs

```text
GET  /api/admin/ping
GET  /api/admin/dashboard
GET  /api/admin/customers
PUT  /api/admin/customers/{id}/role (SUPER_ADMIN only)
GET  /api/admin/orders
PUT  /api/admin/orders/{id}/status
GET  /api/admin/reviews
PUT  /api/admin/reviews/{id}
GET  /api/admin/inventory/low-stock
PUT  /api/admin/inventory/{id}
POST/PUT/DELETE /api/admin/categories...
POST/PUT/DELETE /api/admin/products...
POST /api/admin/uploads/image
```

Every admin endpoint must enforce authorization on the backend.

### Health

```text
GET /actuator/health
```

Expected response:

```json
{"status":"UP","groups":["liveness","readiness"]}
```

Render uses this endpoint as its health check.

## 8. Data model

The main persisted entities are:

- `User`: name, email, phone, BCrypt password hash, role, created timestamp
- `Category`: name, slug, description, icon, image
- `Product`: slug, name, brand, SKU, category, prices, stock, rating, flags,
  images, specifications, tags, timestamps
- Cart/wishlist entities: user-owned product selections
- `Address`: user-owned Bangladesh shipping address and default flag
- `Order` and `OrderItem`: immutable order snapshot data, totals, delivery,
  payment, and status
- `Review`: product/user review with pending moderation state and purchase-derived
  verification
- PC builder saved builds and component selections

Products contain `@ElementCollection` mappings for images, specifications, and
tags. Azure MySQL has a primary-key requirement that is handled per connection
with:

```text
SET SESSION sql_require_primary_key=0
```

Do not remove this without confirming Azure schema behavior. The category
endpoint previously had an N+1 product-count query; it was optimized to use a
single grouped count query. Preserve that optimization.

## 9. Frontend behavior and boundaries

`src/lib/api.ts` is the single shared HTTP wrapper. It:

- Builds URLs from `NEXT_PUBLIC_API_URL`
- Adds JSON headers where appropriate
- Adds the bearer token from local storage
- Uses `cache: 'no-store'`
- Throws `ApiError` for non-2xx responses

Service modules under `src/lib/services/` are the preferred place for API calls.
Components and pages should not duplicate URL construction or auth-header logic.

Zustand stores provide client interactions such as cart drawer state and persisted
cart data. The backend remains authoritative during authenticated cart mutations
and checkout. When changing cart behavior, update both the client store and the
corresponding backend service/contract.

The frontend currently uses a mixture of server components, client components,
and static fallback data. Do not blindly convert a page to static rendering:
check authentication, inventory freshness, and current API behavior first.

## 10. Environment variables

### Frontend: Vercel and local `.env.local`

```env
NEXT_PUBLIC_API_URL=https://nexuspc-backend.onrender.com/api
NEXT_PUBLIC_BKASH_ENABLED=false
```

The backend creates the configured super-admin account at startup only when
that email does not already exist. Store `BOOTSTRAP_SUPERADMIN_PASSWORD` only in the backend host's secret
environment settings or the backend IDE run configuration/shell environment;
remove the password variable after the first successful creation. Never commit
the actual password. The bootstrap never promotes an existing customer
account automatically.

For local frontend development:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_BKASH_ENABLED=false
```

`NEXT_PUBLIC_*` values are intentionally public because browser code uses them.
They must never contain secrets.

### Backend: Render production

```env
PORT=8080
DB_URL=jdbc:mysql://nexuspc.mysql.database.azure.com:3306/nexuspc?sslMode=REQUIRED&serverTimezone=UTC
DB_USERNAME=nexuspcadmin
DB_PASSWORD=<Azure MySQL password>
DB_DRIVER=com.mysql.cj.jdbc.Driver
JPA_DDL_AUTO=update
JWT_SECRET=<random production secret, at least 32 characters>
JWT_EXPIRATION_MS=86400000
BOOTSTRAP_SUPERADMIN_EMAIL=superadmin@nexuspc.com
BOOTSTRAP_SUPERADMIN_PASSWORD=<unique random password, at least 8 characters>
CORS_ALLOWED_ORIGINS=https://nexuspc.sarawer.me,https://nexus-pc-w3q3.vercel.app
FRONTEND_URL=https://nexuspc.sarawer.me
MAIL_HOST=<SMTP server host>
MAIL_PORT=587
MAIL_USERNAME=<SMTP sender username>
MAIL_PASSWORD=<SMTP app password or provider credential>
MAIL_FROM=<verified sender email address>
CLOUDINARY_CLOUD_NAME=<secret-managed value>
CLOUDINARY_API_KEY=<secret-managed value>
CLOUDINARY_API_SECRET=<secret-managed value>
BKASH_ENABLED=false
```

Optional bKash variables exist in `application.properties`, but bKash is
intentionally disabled. Do not enable it with placeholder credentials.

### Backend: local IntelliJ or shell

Use the Azure values for local backend testing:

```env
DB_URL=jdbc:mysql://nexuspc.mysql.database.azure.com:3306/nexuspc?sslMode=REQUIRED&serverTimezone=UTC
DB_USERNAME=nexuspcadmin
DB_PASSWORD=<Azure MySQL password>
DB_DRIVER=com.mysql.cj.jdbc.Driver
JPA_DDL_AUTO=update
JWT_SECRET=<local-only random secret>
JWT_EXPIRATION_MS=86400000
BOOTSTRAP_SUPERADMIN_EMAIL=superadmin@nexuspc.com
BOOTSTRAP_SUPERADMIN_PASSWORD=<unique random password, at least 8 characters>
CORS_ALLOWED_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=<sender email address>
MAIL_PASSWORD=<mail provider app password>
MAIL_FROM=<sender email address>
BKASH_ENABLED=false
```

Azure MySQL firewall must allow the local machine's current public IP for local
backend access. The firewall rule may need updating when the IP changes. Do not
commit these values; `.env.example` is documentation only and is not loaded
automatically by Spring Boot.

## 11. Local development

### Prerequisites

- Java 21
- Maven Wrapper support
- Node.js and npm compatible with the Next.js project
- Access to Azure MySQL, or an explicitly configured H2/local database
- Cloudinary values for image-upload testing

### Start backend

Configure backend environment variables in IntelliJ Run Configuration or the
shell, then:

```bash
cd backend
./mvnw spring-boot:run
```

Backend default port is `8080`.

### Start frontend

Create root `.env.local` with the local API URL, then:

```bash
npm install
npm run dev
```

Frontend default URL is `http://localhost:3000`.

### Validation commands

```bash
cd backend
./mvnw test
./mvnw package

cd ..
npm run build
npm run lint
```

The repository currently has no dedicated frontend `test` script in `package.json`;
do not claim frontend tests passed unless a test runner is added and executed.

## 12. Deployment procedure

### Frontend: Vercel

1. Push the intended commit to `main`.
2. Vercel builds with `npm ci` and `npm run build`.
3. Confirm `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_BKASH_ENABLED` are configured
   for Production and Preview.
4. Redeploy after changing environment variables.
5. Test the custom domain, not only the Vercel deployment URL.

### Backend: Render

Render reads `render.yaml`, builds `backend/Dockerfile`, and exposes port 8080.
The Docker build intentionally uses the Maven image's `mvn` command rather than
the wrapper; the wrapper previously caused Render to interpret `/root/.m2` as an
invalid Maven lifecycle phase.

After backend code or environment changes:

1. Push the commit to `main`.
2. Wait for Render build/deploy.
3. Check `/actuator/health`.
4. Check a public catalog endpoint.
5. Check authentication and any changed protected endpoint.
6. Inspect Render logs if startup fails.

### Database: Azure MySQL

Keep Azure MySQL SSL required. Use the Azure hostname, port 3306, database
`nexuspc`, and the Azure administrator credentials. The database was created as a
small Dev/Test configuration with high availability disabled and locally
redundant backup. Review Azure for Students credit and resource cost before
scaling.

Never delete or reset the database as part of a normal feature deployment.
`JPA_DDL_AUTO=update` is currently used; schema migrations should be planned
carefully before introducing destructive changes.

## 13. Safe feature-development workflow

1. Read this file and the relevant existing source files.
2. Identify the affected frontend service, page/component, backend controller,
   service, repository, DTO, and entity.
3. Preserve existing API response shapes and authentication boundaries.
4. Add validation and error behavior at the backend boundary.
5. Keep controllers thin and prevent entity/password leakage.
6. Run focused backend tests, then `./mvnw test`.
7. Run frontend type-check/build through `npm run build` when Node.js is available.
8. Use a local or test account and verify both success and failure paths.
9. Verify the deployed health endpoint after pushing.
10. Do not enable a later phase or payment integration accidentally while adding
    an unrelated feature.

Normal Git workflow:

```bash
git add .
git commit -m "describe the change"
git push origin main
```

Do not commit secrets. Inspect `git diff --check` before committing.

## 14. Current known limitations

- Render free backend and Azure MySQL are separate services; latency can be
  noticeable, especially for uncached dynamic pages.
- Some frontend requests use `cache: 'no-store'`; performance changes must
  preserve freshness for account/cart/checkout/admin data.
- Product and category data must be recreated in the new Azure database if the
  database is intentionally empty.
- bKash is disabled and has not been production-verified.
- Frontend automated test coverage is not currently established.
- The admin dashboard has broad read/query operations; optimize with pagination
  and projections before using it with a large dataset.
- Local development requires Azure MySQL firewall access unless a separate local
  database profile is deliberately added.

## 15. Agent guardrails

- Never reveal, log, commit, or ask the user to paste passwords, JWT secrets,
  Cloudinary API secrets, or payment secrets.
- Never trust client-submitted price, total, stock, role, or payment status.
- Never bypass `@PreAuthorize` or move authorization solely to the frontend.
- Never expose password hashes through a response DTO.
- Do not change the deployed database provider or environment variable names
  without checking Render, local IntelliJ configuration, and this document.
- Do not remove the Azure MySQL connection-init setting without testing schema
  generation on Azure.
- Do not use destructive database commands or delete resources without explicit
  user approval and a verified backup.
