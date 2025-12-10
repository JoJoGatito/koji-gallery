# Stripe readiness plan for a GitHub Pages site using Stripe-hosted Checkout

Scope: Prepare this static site (hosted on GitHub Pages) to accept payments by sending customers to Stripe-hosted Checkout. This document provides a practical decision guide, complete checklist, platform choices for the required serverless bits (if needed), security requirements, testing plan, and go-live steps tailored to this repo.

Key repo files that may be touched during implementation:
- Entry and content pages that may display purchase CTAs:
  - [index.html](index.html)
  - [gallery.html](gallery.html)
  - [blog.html](blog.html)
  - [404.html](404.html)
- Existing JS that may power UI/cart behavior:
  - [assets/js/cart.js](assets/js/cart.js)
  - [assets/js/main.js](assets/js/main.js)
  - [assets/js/gallery.js](assets/js/gallery.js)
  - [assets/js/blog.js](assets/js/blog.js)
- Product schema/content source (if integrating product metadata from Sanity, price ID mapping, etc.):
  - [schemas/artwork.js](schemas/artwork.js)
  - [assets/js/sanityClient.js](assets/js/sanityClient.js)
- Project docs:
  - [README.md](README.md)
  - [DEPLOYMENT.md](DEPLOYMENT.md)

Note on architecture: GitHub Pages is static-only. If you need dynamic cart-based pricing or post-payment automation, you will add a small serverless component on a provider like Vercel, Netlify, Cloudflare Workers, Deno Deploy, or AWS Lambda. If your needs are simple (single product or a small fixed set of products with no cart), you can use Stripe Payment Links and avoid any backend entirely.

---

## 1) Decide your integration path

Choose ONE based on your requirements. This decision drives everything else.

Option A — Payment Links (no backend)
- Best for:
  - One-time purchases of a fixed product or a small set of products.
  - No dynamic cart aggregation, no custom pricing or coupons generated on-the-fly.
  - Minimal engineering; add a normal link or button on your static pages that goes to a Stripe Payment Link URL.
- Pros:
  - Zero backend (works perfectly with GitHub Pages alone).
  - Stripe handles all compliance (SCA/3DS), tax (if enabled), address collection, and receipts.
  - Can optionally redirect customers back to your site after payment completes.
- Cons:
  - Not suitable for dynamic carts or computed pricing per user/session.
  - Limited programmatic control; metadata and line items are preconfigured when you create the link.

Option B — Programmable Stripe Checkout (serverless endpoint + webhooks)
- Best for:
  - Dynamic cart (line items and quantities per session).
  - Discounts/coupons computed at runtime.
  - Automated fulfillment (digital delivery, CMS updates, inventory decrement).
  - Capturing metadata (e.g., Sanity document IDs) and reconciling orders post-payment via webhooks.
- Pros:
  - Full control of line items at checkout creation.
  - Can map your product data (e.g., Sanity content) to Stripe Prices by ID.
  - Robust post-payment automation with webhooks.
- Cons:
  - Requires a small backend: a “create checkout session” endpoint and a webhook endpoint (cannot be on GitHub Pages; must be on a serverless platform).
  - Slightly more setup (env vars, deploy, CORS).

Decision matrix (quick):
- Need a dynamic cart? Choose Option B.
- Need per-user pricing logic? Option B.
- Only single/fixed products and can tolerate one link per product? Option A.

---

## 2) Stripe account and product setup (applies to both A and B)

- Stripe account and business profile
  - Create/verify your Stripe account.
  - Complete business details, bank account or payouts setup, and public info (business name, support info, statement descriptor).
  - Configure branding (logo, colors) for hosted Checkout.

- Products and prices (dashboard or API)
  - Create your Products and Prices in Stripe.
  - Use standard Prices (recurring or one-time) rather than legacy “SKUs”.
  - For Option A (Payment Links), you will attach these prices to a Payment Link in the dashboard.
  - For Option B (Programmable Checkout), you will reference Price IDs (price_...) in your serverless “create checkout session” function.
  - Keep a mapping between your CMS objects and Stripe Price IDs (e.g., add `stripePriceId` to your content model in [schemas/artwork.js](schemas/artwork.js)).

- Taxes and shipping (if applicable)
  - Turn on Stripe Tax if you need automatic tax calculation.
  - Configure shipping address collection and shipping rates (flat or dynamic via Shipping Rates).

- Customer communications
  - Enable email receipts in Stripe (recommended).
  - Optionally customize the post-payment confirmation and email content.

- Currencies and localization
  - Decide supported currencies.
  - Enable languages for Checkout (Stripe can auto-localize UI).

---

## 3) Implementation plan for Option A (Payment Links — no backend)

What you’ll do:
- Create a Payment Link in Stripe Dashboard for each product/variant you sell.
- For each CTA on your pages (buttons, images, “Buy” links), link directly to the Payment Link URL.
- Configure the Payment Link to optionally redirect back to your site after successful payment. Set the post-payment redirect to a page on your GitHub Pages site, such as a “Thank you” or “Success” page you add to this repo (e.g., /thank-you.html).
  - If you add a new page, include it in the repo (e.g., create `thank-you.html`) and link to it from your Payment Link configuration.
- If you ship physical goods or collect taxes, configure those in the Payment Link (address collection, shipping rates, Stripe Tax).

Where to place links in the repo:
- Product CTAs on:
  - [index.html](index.html)
  - [gallery.html](gallery.html)
  - [blog.html](blog.html)
- Optional header/footer CTA to a generic Payment Link (if selling a single item or donation).

Security notes:
- No API keys or Stripe.js are needed on the client for Payment Links.
- All sensitive processing happens on Stripe’s hosted page.

Optional webhooks:
- If you want to automate fulfillment (e.g., notify a Google Sheet, send a license key, update Sanity), add webhooks on any serverless platform (see Option B’s webhook guidance) even if you use Payment Links. Webhooks are not required for Payment Links to charge cards, but are required for automation.

Testing:
- Create test-mode products and a test Payment Link in Stripe.
- Replace CTAs temporarily with the test Payment Link for validation, then switch to live links for go-live.

Go-live:
- Swap test Payment Links to live ones.
- Verify the redirect returns to your desired success page.

---

## 4) Implementation plan for Option B (Programmable Checkout — serverless)

What you’ll build:
- A single “create checkout session” HTTP endpoint on a serverless platform.
- A webhook endpoint to receive events like `checkout.session.completed` for fulfillment.
- Frontend changes to call your create-session endpoint and redirect users to the Stripe-hosted Checkout page.

Pick one serverless platform:
- Vercel (API Routes / Edge Functions)
- Netlify Functions
- Cloudflare Workers/Pages Functions
- Deno Deploy
- AWS Lambda + API Gateway

Serverless environment variables (example):
- STRIPE_SECRET_KEY (live and test)
- STRIPE_WEBHOOK_SECRET (per environment)
- Any CMS keys (if fulfillment touches Sanity)

CORS:
- Allow your GitHub Pages origin (e.g., https://<user>.github.io/<repo>/ or your custom domain) in the serverless endpoint response headers.

Frontend changes in the repo:
- Place purchase buttons/CTAs in:
  - [index.html](index.html)
  - [gallery.html](gallery.html)
  - [blog.html](blog.html)
- On click:
  - Send the current cart or selected product to your serverless “create checkout session” endpoint.
  - The endpoint returns a Checkout URL; client then redirects window.location to that URL.
  - Alternatively, the endpoint can return `sessionId` and the client uses Stripe.js `redirectToCheckout` (Stripe.js is loaded from Stripe’s CDN). This is optional; redirecting to the URL is simpler and avoids including Stripe.js.

Key backend behavior (create checkout session):
- Validate the incoming payload (never trust client prices/amounts).
- Reconstruct line items exclusively from trusted identifiers (e.g., map client item IDs to Stripe Price IDs server-side).
- Configure:
  - success_url: e.g., https://<your-domain>/thank-you.html?session_id={CHECKOUT_SESSION_ID}
  - cancel_url: e.g., https://<your-domain>/cart.html (if you add a cart page)
  - shipping address collection / shipping rates (if applicable)
  - automatic_tax: true (if using Stripe Tax)
  - metadata: include references you’ll need at fulfillment time (e.g., Sanity doc ID)

Webhook endpoint (fulfillment and reconciliation):
- Listen to these events at minimum:
  - checkout.session.completed (primary trigger for fulfillment)
  - payment_intent.succeeded / payment_intent.payment_failed (if you need granular status)
  - charge.dispute.created (optional risk handling)
- Verify the webhook signature using STRIPE_WEBHOOK_SECRET.
- Perform fulfillment:
  - Digital goods: generate and send license/download link.
  - Physical goods: create fulfillment task or integrate with your shipping system.
  - CMS: write order record / decrement inventory in Sanity via [assets/js/sanityClient.js](assets/js/sanityClient.js) logic mirrored in a server environment.
- Respond 2xx on success.

Cart and product mapping in this repo:
- If using the existing client cart in [assets/js/cart.js](assets/js/cart.js), add a reliable product identifier for each cart item that your serverless function will recognize (e.g., a Sanity document _id or a custom SKU that maps to a Stripe Price ID).
- Do not send prices or totals from the client to Stripe. Only send product IDs and quantities. The serverless function must perform all price lookups and calculations using Stripe Price IDs.
- Consider storing the Stripe Price ID on your product documents in [schemas/artwork.js](schemas/artwork.js) (e.g., `stripePriceId`), so the serverless function can fetch the product in Sanity (read-only) and derive the correct Price ID.

Security checklist:
- Never expose STRIPE_SECRET_KEY in the frontend or this repo.
- Enforce input validation and only build line_items on the server from trusted sources.
- Lock down CORS to your production domain.
- Use separate test and live environments (keys, webhook secrets).

---

## 5) Pages and UX on your static site

Add or confirm these pages:
- Purchase CTAs on relevant pages:
  - [index.html](index.html)
  - [gallery.html](gallery.html)
  - [blog.html](blog.html)
- Success/Thank-you page:
  - Create a `thank-you.html` (not currently in repo) with order messaging and “Continue browsing” link back to [index.html](index.html).
  - Consider reading `session_id` from the URL (if you want to show basic status via a client-side fetch to your serverless API — optional).
- Cancel page:
  - Optionally create `cart.html` or reuse an existing page to re-engage the user if they cancel at Checkout.

Branding:
- Set brand logo and colors in Stripe Dashboard so the hosted Checkout page matches your site.

Accessibility:
- Use standard buttons and link semantics so screen readers can easily find the purchase CTAs.

---

## 6) Testing plan

Test keys and data:
- Keep separate test products and Price IDs in Stripe test mode.
- For Option A: create a test Payment Link and wire your CTAs to it during QA.
- For Option B: point your serverless endpoint to Stripe test mode using STRIPE_SECRET_KEY (test) and a test webhook secret.

Test cards and flows:
- Use Stripe’s test cards (e.g., 4242 4242 4242 4242) to simulate success, 3DS challenges, and failures.
- Simulate taxes and shipping as applicable.

Webhooks (Option B and optional for A):
- Use Stripe CLI locally to forward events to your webhook during development:
  - stripe login
  - stripe listen --forward-to https://<your-dev-endpoint>/api/webhooks/stripe
- Verify your webhook signature validation and fulfillment logic.

E2E runbook:
- Click purchase CTA on [index.html](index.html) or [gallery.html](gallery.html)
- Confirm redirect to Stripe Checkout.
- Complete a test payment.
- Confirm redirect to your thank-you page.
- Verify back-office effects:
  - Emails sent.
  - Fulfillment executed.
  - Sanity updated (if applicable).
  - Order recorded/logged.

---

## 7) Go-live checklist

Account:
- [ ] Business profile complete in Stripe (branding, policies, bank account).
- [ ] Taxes and shipping configured (if applicable).
- [ ] Email receipts enabled.

Products/prices:
- [ ] Live-mode Products and Prices created.
- [ ] Price IDs mapped to your content model (if Option B).

CTAs and pages:
- [ ] Purchase CTAs point to live Payment Links (Option A) or call the live serverless endpoint (Option B).
- [ ] Success page exists and is linked as success_url or Payment Link redirect target.
- [ ] Cancel page (optional) exists.

Serverless (Option B):
- [ ] Environment variables set: STRIPE_SECRET_KEY (live), STRIPE_WEBHOOK_SECRET (live).
- [ ] CORS restricted to your production domain.
- [ ] Create-checkout-session endpoint deployed and verified.
- [ ] Webhook endpoint deployed, subscription configured in Stripe Dashboard, and verified.

Security:
- [ ] No secret keys in frontend or repo.
- [ ] Server-only price reconstruction from trusted IDs.
- [ ] Minimal scopes for any third-party integrations.

Compliance and policy:
- [ ] Terms of Service and Privacy Policy linked on your site (footer or checkout).
- [ ] Refund/return policy documented.

Final validation:
- [ ] Test a $0.50–$1.00 live transaction on production to validate end-to-end.
- [ ] Analytics/conversion tracking confirmed (if used).

---

## 8) Platform-specific notes

GitHub Pages:
- Static hosting only; no server-side. Works perfectly with Payment Links.
- For Option B, deploy serverless endpoints elsewhere (e.g., Vercel). Your static pages will POST/GET to that service’s URL.

Vercel (good default for Option B):
- Connect this GitHub repo and add a new Vercel project for the API only (you can also host the static site there if desired, but not required).
- Create /api/create-checkout-session and /api/webhooks/stripe.
- Add environment variables in Vercel project settings (test and production).
- Configure CORS to allow your GitHub Pages domain.
- Use separate projects/environments or environment variables for test vs live.

Netlify / Cloudflare / Deno / AWS:
- The same structure applies: one endpoint to create sessions, one for webhooks, env vars configured in provider settings, and strict CORS.

---

## 9) CMS and data model mapping (if using Sanity)

If products are modeled in Sanity:
- Add a `stripePriceId` field (and optional `stripeProductId`) to your product schema in [schemas/artwork.js](schemas/artwork.js).
- In the serverless “create checkout session” endpoint:
  - Trust only the product ID from the client.
  - Fetch the product from Sanity server-side.
  - Read `stripePriceId` and build Stripe `line_items` from those IDs.
  - Include metadata (e.g., the Sanity document ID) in the Checkout Session for later reconciliation at the webhook.
- Keep Price IDs consistent across test and live (document both or maintain environment-specific mappings).

---

## 10) Security and fraud

- PCI compliance is largely handled by Stripe Checkout.
- Radar (Stripe fraud detection) is enabled by default; consider rules if you see issues.
- Do not accept prices/amounts from the client. Always calculate on the server from Stripe Price IDs.
- Validate quantities (min/max) and product availability (inventory) server-side before creating Checkout Sessions.
- Consider rate limiting on your serverless endpoints.

---

## 11) Analytics and post-payment experience

- Consider adding UTM parameters to success_url so you can attribute conversions.
- Stripe Checkout can send customers back to your site; ensure the thank-you page:
  - Confirms order received.
  - Provides next steps (for digital delivery, provide clear messaging; for physical, provide shipping timelines).
- Optional: on the thank-you page, call a read-only endpoint to fetch order summary by `session_id` (if desired).

---

## 12) Maintenance and operations

- Refunds and disputes handled in Stripe Dashboard (or create an admin endpoint if needed).
- Keep products and Price IDs in sync with your CMS if you add/remove products.
- Rotate keys if you suspect leakage; keep secrets out of this repo.

---

## 13) What to build next in this repo (actionable)

Choose Option A or B, then:

If Option A (Payment Links):
- [ ] Create or confirm test Payment Link(s) in Stripe.
- [ ] Wire CTAs in [index.html](index.html), [gallery.html](gallery.html), [blog.html](blog.html) to the test Payment Link(s).
- [ ] Add a new thank-you page (thank-you.html) and configure Payment Link post-payment redirect.
- [ ] Run test purchases, then swap to live links.

If Option B (Programmable Checkout):
- [ ] Pick a serverless platform (recommend Vercel).
- [ ] Implement /api/create-checkout-session and /api/webhooks/stripe with environment variables.
- [ ] In [assets/js/cart.js](assets/js/cart.js), ensure each item has a trusted product ID your serverless function can map to a Stripe Price ID.
- [ ] Update purchase buttons in [index.html](index.html) and [gallery.html](gallery.html) to call your create-session endpoint and redirect to the returned Checkout URL.
- [ ] Add thank-you.html and set success_url/cancel_url.
- [ ] Subscribe webhooks in Stripe Dashboard and verify fulfillment.
- [ ] Full end-to-end test, then switch to live keys.

---

## 14) References (suggested reading)

- Stripe Checkout overview (hosted)
- Stripe Payment Links
- Stripe Taxes
- Shipping with Checkout
- Stripe Webhooks security
- Test card numbers and scenarios
- Branding settings for Checkout

(Access these from Stripe’s official docs. Bookmark them in your team knowledge base.)

---

This plan keeps the site static on GitHub Pages while using Stripe-hosted Checkout. For simple sales, Payment Links are the fastest path. For dynamic carts or automation, add a minimal serverless backend elsewhere and keep the static site as-is.