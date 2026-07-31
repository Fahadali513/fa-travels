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

## Latest updates
- Mobile menu now includes **Login/My Account** and **Book Now**, and the
  header no longer causes horizontal scrolling on small screens.
- Contact form submissions are saved and viewable in **Admin → Messages**
  (with unread count, mark read/unread, delete).
- Every image field (package cover photo, gallery, blog, homepage hero image)
  now has an **"Upload From Device"** option alongside the URL field.
- Customers can attach their own photo when leaving a review.
- **Admin login is no longer remembered** — reloading the page or reopening
  the site always requires logging in again (customer login still persists).
- Privacy Policy and Terms & Conditions text are now editable from
  Admin → Website Settings → Legal Pages.

## Latest updates (round 3)
- **Fixed a real overflow bug**: the desktop nav was cramped/cut off on
  medium-width windows (roughly 960–1400px) because it never collapsed to
  the mobile menu early enough. The collapse breakpoint is now wider so the
  full nav only shows when there's actually room for it.
- **Phone number at signup is optional.**
- **Booking history filters**: customers can filter "My Bookings" by month
  and year on their dashboard; admins can open any customer's full profile
  (Admin → Customers → View History) and filter that same way, seeing
  all-time history plus phone, photo, and join date.
- **Ask a Question**: customers can submit a question from their dashboard;
  admins answer it from Admin → Customer Questions, and the reply shows up
  back on the customer's dashboard under their question.
- **Show/hide password** eye-icon toggle added to every password field
  (login, register, admin login, change-password forms, etc.) — this is the
  safe way to "view" a password without ever storing or displaying it in
  plain text anywhere.
- **Customer-side Forgot Password**: at signup, customers set their own
  custom security question and answer (their choice of wording, not a fixed
  list) and can use it later at `#/forgot` to reset their password — same
  pattern as the admin's own forgot-password flow.
- **Profile photo at signup**: customers can upload a picture when creating
  their account (or later from Profile Settings), shown next to their name
  on the dashboard and in the admin's Customers list / customer detail page.

## Latest updates (round 5) — critical mobile bug fix
Found and fixed a real regression: an earlier edit to widen the nav breakpoint
accidentally deleted the CSS rule that hides the full nav menu on mobile/
tablet widths. That's exactly the overlapping-header bug in your screenshot —
the desktop nav was rendering (and overflowing) at every screen size instead
of collapsing into the hamburger menu. It's fixed now and verified: the nav
correctly collapses below 1220px width, with no leftover rule to accidentally
keep it visible.

**Please re-download this whole folder fresh** (don't reuse an old copy) and
do a hard refresh in your browser (Ctrl/Cmd+Shift+R) if you had a previous
version open, so you're not looking at a cached copy of the broken CSS.

Everything from your long feature list (answer-in-account, change/delete
password, delete account without removing admin's record, unique username,
customer gallery uploads with name credit, all-time + month/year history,
Ask-a-Question tied to account, admin visibility into customer accounts, and
customer-written blog posts with photos) was already built in the previous
round — see "round 3/4" notes below for exactly what each does. Admin still
can't view a customer's raw password (see the round 4 note on why), but can
reset it for them.

## Latest updates (round 4)
- **Unique usernames**: registration now requires a nickname/username, checked
  for uniqueness (case-insensitive) at signup and if changed later in Profile
  Settings.
- **Self-service account deletion**: customers get a "Danger Zone" panel to
  delete their own account. It signs them out and blocks future logins, but
  the record and all booking history stay fully visible to admin (status
  shows as "Deactivated"), which admin can reverse with a "Reactivate" button.
- **Admin password reset (not viewing)**: passwords are one-way hashed
  everywhere, so even admin can't see the original text — instead, the
  customer detail page has a "Reset Password" button that generates a new
  temporary password for admin to relay to the customer.
- **Customer-submitted gallery photos**: dashboard → "Share a Photo" (device
  upload + category) goes into an admin approval queue (Admin → Gallery →
  Pending Customer Submissions); once approved it appears publicly with a
  "📷 @username" credit overlay on the photo.
- **Customer-submitted blog stories**: dashboard → "Share Your Travel Story"
  (title + cover photo + story text) goes into an admin approval queue
  (Admin → Blog → Pending Customer Stories); once approved it's published
  with a "by @username" byline.
- Admin's Customer Detail page now shows username, phone, photo, join date,
  security question, account status, full booking history (all-time or
  filtered by month/year), and every question that customer has asked.

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
