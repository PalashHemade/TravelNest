# ✈️ TravelNest — Travel Agency SaaS Platform

> A full-stack, production-ready travel booking platform built with **Next.js 16**, **MongoDB**, and **NextAuth v5**. Supports two distinct roles — Traveler and Admin — each with their own dedicated experience.

---

## 🌍 What is TravelNest?

TravelNest is a modern travel agency web application where:

- **Travelers** can browse destinations, explore curated travel packages, make bookings, and submit custom trip requests.
- **Admins** can manage the entire platform — adding destinations, creating packages, reviewing bookings, and responding to custom requests — all from a dedicated admin panel.

Everything an admin adds is **instantly visible** to users. No rebuilds, no delays.

---

## ✨ Features

### 👤 Authentication
- Role-based sign-up and sign-in — choose **Traveler 🧳** or **Admin 🛠️** at registration
- Role is saved to the database and persisted in the JWT session
- Wrong role on login = clear error message, not a generic failure
- Google OAuth support (signs in as Traveler by default)
- Passwords hashed with `bcryptjs`

### 🧳 Traveler Dashboard (`/dashboard`)
| Page | What it does |
|------|-------------|
| Overview | Stats: total bookings, active trips, total spent |
| My Bookings | View all bookings with status badges |
| New Booking | Pick a package, date, travelers → auto-calculates price |
| Custom Package | Request a tailored trip — destinations, days, budget, notes |
| Settings | Read-only profile view (editing is admin-only) |

### 🛠️ Admin Panel (`/admin`)
| Page | What it does |
|------|-------------|
| Overview | Revenue, booking count, user count, package count + recent sales |
| Destinations | Create / edit / delete destinations (shown on `/destinations`) |
| Packages | Create / edit / delete packages with 3/5/7/9-day presets |
| Bookings | View all bookings, update status inline (pending → confirmed → completed / cancelled) |
| Custom Requests | View user requests, add admin notes, update status |
| Settings | Edit name and password (admin-only) |

### 🌐 Public Pages
- **Home** — Landing page with featured destinations and packages
- **Destinations** (`/destinations`) — Real-time destination cards fetched from DB
- **Packages** (`/packages`) — Filterable package listings
- **Blog** — Travel blog section
- **Contact** — Contact form
- **Book** — Direct booking flow

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Database | MongoDB via [Mongoose](https://mongoosejs.com) |
| Auth | [NextAuth v5](https://authjs.dev) (JWT strategy) |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI primitives + custom shadcn-style components |
| Forms | React Hook Form + Zod validation |
| Notifications | Sonner (toast) |
| Icons | Lucide React |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Google OAuth credentials (optional, for Google sign-in)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd travel-agencu
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/travelnest

# NextAuth
AUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App URL
NEXTAUTH_URL=http://localhost:3000
```
### 3. Seed the database (optional)

Populate the database with sample packages:

```bash
npx ts-node scripts/seed-data.ts
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Role System

| Role | Access |
|------|--------|
| **Traveler** | Browse destinations & packages, create bookings, submit custom requests, view profile |
| **Admin** | Everything above + full CRUD on destinations/packages, manage all bookings, respond to custom requests, edit profile settings |

**How it works:**
1. Choose your role on the **Register** page — the role is saved to the database
2. On **Login**, select the same role — if it doesn't match your account, you'll get a clear error
3. The role is stored in the **JWT session** and enforced on both the UI and API level

---

## 📦 Database Models

| Model | Purpose |
|-------|---------|
| `User` | Stores name, email, hashed password, role, provider |
| `Package` | Travel packages with price, duration, destination, amenities |
| `Booking` | Links user + package, tracks status and payment |
| `Destination` | Admin-managed destinations shown on the public page |
| `CustomPackageRequest` | User-submitted custom trip requests with admin notes |


