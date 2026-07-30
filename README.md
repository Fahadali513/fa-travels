# Fahad Travels — Front-End Prototype

This is a fully working **front-end demo** of the site you described: every
page, the booking flow (with a time-limited edit/cancel window), and a full
admin CMS — running entirely in the browser with no server required.

## How to open it
Just open `index.html` in any modern browser (double-click it, or drag it
into a Chrome/Edge/Firefox window). No install, no build step.

For the smoothest experience (especially the Google Maps embed on the
Contact page), serve it locally instead of opening the file directly:
```bash
cd fahad-travels
python3 -m http.server 8080
# then visit http://localhost:8080
```

## What works right now
- Every public page: Home, About, Packages (with filters/sorting), Package
  Details, Booking, Gallery (with lightbox), Reviews, Blog, FAQs, Contact,
  Privacy Policy, Terms, 404.
- **Ticket booking with a time-limited edit window**: when a customer books
  a package, the booking gets a `createdAt` timestamp. From their Customer
  Dashboard they can **Edit** or **Cancel** the booking only until the
  admin-configured window closes (default **24 hours**, changeable in
  Admin → Website Settings). After that it locks automatically and shows
  "Edit window closed."
- Customer Register/Login/Dashboard (My Bookings, Profile).
- Full Admin CMS at `#/admin/login`:
  - **Username:** `Fahad` **Password:** `Fahadtravels`
  - Dashboard overview with KPIs, revenue, recent activity
  - Packages: add / edit / duplicate / archive / delete
  - Bookings: accept / complete / cancel / refund, with edit-window shown per booking
  - Gallery, Reviews (approve/reject), Blog, FAQs, Customers, Coupons — all CRUD
  - Website Settings: name, tagline, about/mission/vision/story, contact info,
    social links, currency, homepage stats, maintenance flag
  - Account & Security: change admin username, password, and security
    question/answer (used by "Forgot password" on the admin login page)
- Dark mode, sticky nav, scroll animations, mobile responsive nav, cookie
  consent, back-to-top, loading screen, toasts.
- All content — packages, gallery, reviews, FAQs, blog, settings — is stored
  in the browser's `localStorage`, so anything the admin edits is what
  visitors see. Clearing browser storage resets it to the seed data.

## Important: this is a prototype, not a deployed backend
There's no real server, database, payment processor, or email service here
— everything above runs client-side for demonstration. That means:
- "Payments" (Stripe/PayPal/Bank Transfer/Cash) are recorded as a choice on
  the booking, not actually charged.
- "Confirmation emails" and "Admin notifications" are simulated via on-screen
  toasts, not real emails.
- Data lives in one browser only — it won't sync across devices or survive
  a cleared cache, and there's no real user-password security beyond a
  client-side SHA-256 hash (not a substitute for a real backend with bcrypt,
  HTTPS, and a database).

## Turning this into the real, production MERN system
The full spec you described (Node/Express/MongoDB, JWT + bcrypt auth,
Stripe/PayPal live payments, Cloudinary uploads, Nodemailer emails, RBAC,
2FA, real deployment) is a genuine multi-week build. The cleanest next step
is to open this project in **Claude Code** (desktop or CLI), where a real
dev environment lets us:
1. Scaffold the Express + MongoDB API matching the data model already used
   here (Package, Booking, Customer, Admin, Review, Blog, FAQ, Coupon, Settings).
2. Swap this prototype's `localStorage` calls for real API calls (the UI and
   routes barely have to change).
3. Wire up your real Stripe/PayPal keys, Cloudinary account, and SMTP creds.
4. Deploy: Vercel (frontend), Render/Railway (backend), MongoDB Atlas (DB).

This prototype can be handed straight to that process as the approved design
and interaction spec.
