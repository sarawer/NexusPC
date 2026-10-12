# NexusPC backend — Phase 6

Spring Boot 3.3.5, Java 21, MVC, validation, JPA, MySQL runtime driver, H2 fallback, CORS, and JWT authentication. Phase 2 provides customer registration/login and the authenticated account endpoint; catalog, carts, and orders remain deferred.

## Frontend implementation report

The existing Next.js frontend is currently mock-backed. Its main contracts are:

- **Entities:** user, address, category, brand, product, product image, review, cart, wishlist, order, order item, and PC build.
- **Relationships:** a category has products; products have images, specifications, and reviews; users own addresses, carts, wishlists, orders, and saved builds; orders contain immutable product line items.
- **Primary API groups:** authentication/account, catalog/search, cart, wishlist, checkout/orders, addresses, reviews, PC builder, and admin management.
- **Frontend services to replace:** `src/lib/services/productService.ts` currently reads `src/data/products.ts`; cart, wishlist, and PC-builder state currently live in persisted Zustand stores.
- **Important fields:** product slug, category slug, stock count/status, price/original price, images, specifications, ratings, order delivery/payment/status, and Bangladesh shipping address fields. PC-builder compatibility reads `Socket`, `Power Consumption`, and `Wattage` specifications.

Phase 3 adds the catalog (categories and products). Phase 4 adds authenticated,
user-owned carts and wishlists. Phase 5 adds orders, checkout, and addresses;
Phase 6 adds reviews, PC Builder, and administration.

## Run

```bash
./mvnw spring-boot:run
```

By default the app uses an in-memory H2 database. Configure MySQL with `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_DRIVER=com.mysql.cj.jdbc.Driver`; set `JPA_DDL_AUTO=update` for a persistent schema. Configure allowed frontend origins with `CORS_ALLOWED_ORIGINS` (comma-separated patterns).
Set `JWT_SECRET` to a randomly generated value of at least 32 characters before starting the application. Tokens expire after `JWT_EXPIRATION_MS` (default 24 hours).

The Maven wrapper requires Java 21 or newer. Run `./mvnw test` from this directory after installing a JDK.

## Phase 2 endpoints

- `POST /api/auth/register` — creates a customer and returns a JWT plus public user data.
- `POST /api/auth/login` — authenticates by email and password.
- `GET /api/auth/me` — returns the authenticated user; requires `Authorization: Bearer <token>`.
- `GET /api/admin/ping` — authentication smoke-test endpoint; requires an `ADMIN` role.

## Phase 3 catalog endpoints

Public category endpoints are `GET /api/categories` and `GET /api/categories/{slug}`.
Public product browsing is `GET /api/products` (optional `q`, `category`, `brand`,
`minPrice`, `maxPrice`, `featured`, `bestseller`, `new`, `page`, `size`, and
`sort=createdAt,desc` parameters), `GET /api/products/{slug}` (also available as
`/api/products/slug/{slug}`), and the convenience feeds
`/api/products/featured`, `/api/products/bestsellers`, and `/api/products/new`.
Responses use the frontend product/category contract, including stock status,
images, specifications, tags, and pagination metadata.

Create, update, and delete operations are available on the same category/product
resources (`POST/PUT/DELETE`) and are protected with `ADMIN` authorization.
Product images are represented by URL/alt records and specifications by a
simple string map; Cloudinary can be added behind this boundary later.

Required environment variables:

```text
JWT_SECRET=<random secret with at least 32 characters>
JWT_EXPIRATION_MS=86400000
```

## Phase 4 cart and wishlist endpoints

All endpoints below require the bearer token returned by login/register.

- `GET /api/cart` — returns the authenticated user's cart, totals, and frontend-compatible item fields.
- `POST /api/cart/items` — adds `{ "productId": 1, "quantity": 2 }`; an existing item's quantity is increased.
- `PUT /api/cart/items/{productId}` — replaces an item's quantity.
- `DELETE /api/cart/items/{productId}` and `DELETE /api/cart/clear` — remove one or all items.
- `GET /api/wishlist` — lists saved products.
- `POST /api/wishlist` — saves `{ "productId": 1 }` (idempotent).
- `DELETE /api/wishlist/{productId}` — removes a saved product.

Cart mutations validate that products exist, quantities are positive, and requested
quantities do not exceed current stock. Prices are always read from the catalog;
clients cannot submit or override prices. The `coupon` response field is currently
`null` as a placeholder for a future coupon phase.

## Phase 5 addresses and orders

Authenticated users can manage addresses with `GET/POST /api/addresses`,
`PUT/DELETE /api/addresses/{id}`, and `PUT /api/addresses/{id}/default`.
The first address is automatically default. Checkout is `POST /api/orders`
with validated `items` (`productId`, `quantity`), either an owned `addressId`
or complete `shippingAddress`, `deliveryMethod` (`inside_dhaka` or
`outside_dhaka`), `paymentMethod` (`cod`, `bkash`, `stripe`, `nagad`, `card`, or
`bank_transfer`), and optional `couponCode`/`notes`. Prices, delivery charges,
totals, and stock are calculated server-side. Creation is transactional,
decrements stock, and clears the user's cart. `GET /api/orders` and
`GET /api/orders/{id}` are owner-scoped; pending and confirmed orders can be
cancelled with `POST /api/orders/{id}/cancel`. Admins use
`GET /api/admin/orders` and `PUT /api/admin/orders/{id}/status`.
Coupon codes are retained as a future placeholder and do not currently apply
a discount.

## Phase 6 reviews, PC Builder, and administration

Reviews are exposed at `GET /api/products/{slug}/reviews` and authenticated
`POST/PUT/DELETE` review endpoints. Customers can submit one review per
product; `verified` is derived from a non-cancelled purchase. New and edited
reviews are pending moderation. Administrators can list and approve/reject
reviews with `/api/admin/reviews`.

The PC Builder validates stock and CPU/motherboard socket compatibility with
`POST /api/pc-builder/validate` (for example, `{"cpu":1,"motherboard":2}`).
Authenticated customers can save, list, inspect, and delete builds under
`/api/pc-builder/builds`.

Administrators have dashboard metrics at `/api/admin/dashboard`, a read-only
customer list at `/api/admin/customers`, and low-stock/stock update endpoints
under `/api/admin/inventory`. All admin endpoints require the `ADMIN` role.
