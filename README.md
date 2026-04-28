# ✈️ TravelNest — Travel Agency SaaS Platform

> A full-stack travel booking platform built with **Next.js 16**, **TypeScript**, **NextAuth v5**, and **Amazon DynamoDB**. TravelNest supports two primary roles — **Traveler** and **Admin** — with separate user experiences and access controls.

---

## 🌍 What is TravelNest?

TravelNest is a modern travel agency web application designed to serve both travelers and platform administrators.

- **Traveler**: browse destinations, explore curated travel packages, submit bookings, request custom itineraries, view booking invoices, and manage profile settings.
- **Admin**: manage destinations, packages, bookings, custom trip requests, blog content, and users through a dedicated admin dashboard.

All data is stored in **Amazon DynamoDB** through the AWS SDK DocumentClient, so admin content and traveler actions are stored in a fully managed NoSQL database.

---

## ✨ Complete Feature List

### 📌 Authentication & Roles
- **Register** with email, password, name, and role selection (`user` or `admin`)
- **Login** with credentials and role selection
- **Google OAuth** sign-in creates Traveler users automatically
- Role-based authorization enforced in both UI and API routes
- Role mismatch detection prevents signing in with the wrong role
- JWT session strategy through **NextAuth v5**
- Password hashing via `bcryptjs`

### 🌐 Public Pages
- **Home** landing page with featured destinations, packages, testimonials, and value propositions
- **Destinations** page showing all available travel destinations
- **Packages** page showing curated travel packages with details
- **Blog** page for travel articles and inspiration
- **Blog detail pages** for reading individual blog posts
- **Contact** page with company details and contact CTA
- **Book package** page with booking form for the selected package
- **Login** page with role picker and Google sign-in support
- **Register** page for new Travelers or Admins

### 🧳 Traveler Experience
- **Dashboard** showing booking overview, spending, and upcoming trips
- **My Bookings** list of traveler bookings with status and payment state
- **Booking details** pages with itinerary, traveler count, contact info, and total cost
- **Invoice view** for bookings with print support
- **Package booking flow** with date selection, traveler count, contact email, phone, and special requests
- **Automatic total price calculation** using package price × traveler count
- **Custom trip request form** for travelers to request tailored itineraries including:
  - destination list
  - preferred duration
  - traveler count
  - budget guidance
  - optional notes
- **Settings** page showing profile data and access restrictions (admin-only editing)

### 🛠️ Admin Experience
- **Admin dashboard** with high-level stats for bookings, packages, destinations, users, and revenue indicators
- **Destination management** with create, edit, and delete functionality
- **Package management** with create, edit, and delete functionality
- **Booking management** with full list of all bookings and inline status updates
- **Custom request management** with admin notes, status updates, and request review
- **Blog management** for creating and publishing travel blog posts
- **User list** view showing all registered users, providers, and roles
- **Admin settings** for profile updates and password changes

### 📊 Booking & Payment Flow
- **Booking status tracking**: `pending`, `confirmed`, `completed`, and `cancelled`
- **Payment state tracking**: `unpaid`, `paid`, and status-aware display in booking tables
- **Mock payment page** for both online payment simulation and manual proof upload
- **Invoice printing** for travel bookings

### 🧾 Data Management & Persistence
- **Amazon DynamoDB** for all persistent storage
- Service layer in `src/lib/db/*` for:
  - users
  - packages
  - destinations
  - bookings
  - blogs
  - custom requests
- **DynamoDB DocumentClient** configured in `src/lib/dynamodb.ts`
- AWS credentials support via environment variables for local and deployed usage

### 🧰 UI / UX
- Responsive layout using **Tailwind CSS v4**
- Custom shadcn-style form, card, button, table, badge, and input components
- Reusable admin sidebar and dashboard components
- Toast notifications by **Sonner**
- Icons from **Lucide React**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | Amazon DynamoDB (AWS SDK DocumentClient) |
| Auth | NextAuth v5 (JWT strategy) |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form + Zod validation |
| Notifications | Sonner |
| Icons | Lucide React |

---

## 🔐 Role Definitions

### Traveler (`user`)
- Browse destinations, packages, and blogs
- Submit package bookings with traveler count and special requests
- Send custom itinerary requests to admin
- View booking history and booking invoice details
- Access dashboard summary and settings

### Admin (`admin`)
- Full access to the admin dashboard
- Create, edit, delete destinations and packages
- Review, update, and manage all bookings
- Review and respond to custom trip requests
- Create and manage blog posts
- View registered users and their role/provider details
- Update profile and password in admin settings

> Note: Only admins can access routes and pages under `/admin`, while travelers use `/dashboard` and public browsing routes.

---

## 📦 Environment Variables

Create a `.env.local` file in the project root with the following values:

```env
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=your-nextauth-secret
AWS_REGION=ap-south-1
AWS_ACCESS_KEY=your-aws-access-key
AWS_SECRET_KEY=your-aws-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

- `AWS_REGION`, `AWS_ACCESS_KEY`, and `AWS_SECRET_KEY` are required for DynamoDB access.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are optional for Google OAuth sign-in.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
git clone <your-repo-url>
cd travel-agencu
npm install
```

### 2. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Build for production

```bash
npm run build
npm start
```

---

## 📁 Project Structure Highlights

- `src/app/` — Next.js App Router pages and layouts
- `src/app/admin/` — admin dashboard pages
- `src/app/dashboard/` — traveler dashboard pages
- `src/lib/db/` — DynamoDB service layer for data access
- `src/lib/dynamodb.ts` — AWS DynamoDB DocumentClient configuration
- `src/components/` — reusable UI components and admin widgets
- `src/auth.ts` — NextAuth configuration

---

## 🚩 Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## 💡 Notes

- This app uses **Amazon DynamoDB** for all persistent storage.
- The project is designed for both traveler and admin user flows with role-based data access.
- Admins can manage platform content while travelers can book trips and request custom itineraries.


