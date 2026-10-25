# Sweet Treats Bakery — QR Digital Menu Management System

A full-stack MERN application for a bakery's QR-code digital menu, seeded with your real menu (Bakery Snacks, Piece Cakes, Dry Cakes, Pastries, Kg Cakes, Cookies & Rusk, Mixtures & Namkeen, Sweets, Fresh Juices, Milkshakes, Tea & Beverages, Fast Food).

## Folder Structure

```
bakery-menu-system/
├── server/                 Node/Express/MongoDB API
│   ├── config/db.js
│   ├── controllers/        auth, category, menu, chatbot, restaurant
│   ├── middleware/         JWT auth guard, error handler, asyncHandler
│   ├── models/             Admin, Restaurant, Category, MenuItem, ChatbotQuestion
│   ├── routes/
│   ├── seed/                seedData.js (your menu, structured) + seed.js (loader script)
│   ├── utils/
│   ├── .env.example
│   └── server.js
└── client/                 React (Vite) + Tailwind
    ├── src/
    │   ├── components/      FoodCard, Chatbot, Sidebar, StatCard, modals, etc.
    │   ├── context/          AuthContext (admin JWT session)
    │   ├── pages/user/       MenuPage, ItemDetailPage (public, no login)
    │   ├── pages/admin/      Login, Dashboard, Categories, MenuItems, Chatbot, QRCode, Settings
    │   └── services/api.js  Axios client + all API calls
    └── .env.example
```

## Database Schema

- **Admin**: name, email, password (bcrypt-hashed), restaurantId, timestamps
- **Restaurant**: name, logo, description, openingHours, menuUrl, qrCode (base64 PNG), timestamps
- **Category**: name, description, displayOrder, restaurantId (ref), timestamps
- **MenuItem**: name, description, price, unit (`piece`/`kg`/`100g`/`glass`), image, categoryId (ref), restaurantId (ref), isVegetarian, isAvailable, isPopular, isSpicy, isChefSpecial, timestamps
- **ChatbotQuestion**: question, answer, category, restaurantId (ref), isActive, timestamps

## API Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | — | Admin login, returns JWT |
| GET | `/auth/me` | admin | Current admin profile |
| GET | `/categories?restaurantId=` | — | List categories |
| POST | `/categories` | admin | Create category |
| PUT | `/categories/:id` | admin | Update category |
| DELETE | `/categories/:id` | admin | Delete category (blocked if items reference it) |
| GET | `/menu?restaurantId=&category=&search=&veg=&available=` | — | List menu items (public menu uses this) |
| GET | `/menu/:id` | — | Single item |
| POST | `/menu` | admin | Create item |
| PUT | `/menu/:id` | admin | Update item |
| PATCH | `/menu/:id/availability` | admin | Quick availability toggle |
| DELETE | `/menu/:id` | admin | Delete item |
| GET | `/chatbot/questions?restaurantId=&activeOnly=` | — | List predefined Q&A |
| POST | `/chatbot/questions/ask` | — | `{ restaurantId, text }` → keyword-matched answer, or the "no answer" fallback |
| POST | `/chatbot/questions` | admin | Create question |
| PUT | `/chatbot/questions/:id` | admin | Update question |
| DELETE | `/chatbot/questions/:id` | admin | Delete question |
| GET | `/restaurant/:id` | — | Restaurant profile (public menu header) |
| PUT | `/restaurant/:id` | admin | Update restaurant profile |
| GET | `/restaurant/:id/dashboard` | admin | Dashboard stat counts |
| GET | `/restaurant/:id/qr` | admin | (Re)generate QR pointing at `/menu/:id` |

All admin-only routes require `Authorization: Bearer <token>`.

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- A MongoDB instance — either local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 2. Backend

```bash
cd server
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, CLIENT_URL
npm install
npm run seed      # loads your bakery menu + creates the first admin
npm run dev        # starts on http://localhost:5000
```

The seed script prints something like:

```
Restaurant ID:  6620...
Public menu:    http://localhost:5173/menu/6620...
Admin login:    admin@bakery.com / admin123
```

**Change that default admin password** after your first login (there's no self-service "change password" screen yet — update it directly in MongoDB or extend the Settings page).

### 3. Frontend

```bash
cd client
cp .env.example .env
# set VITE_API_URL=http://localhost:5000/api
# optionally set VITE_RESTAURANT_ID to the id printed by the seed script,
# so visiting "/" redirects straight to your menu
npm install
npm run dev        # starts on http://localhost:5173
```

Visit `http://localhost:5173/menu/<restaurantId>` for the public menu, and `http://localhost:5173/admin/login` for the dashboard.

### 4. Connecting MongoDB
- **Local**: install MongoDB Community Server, run `mongod`, use `MONGO_URI=mongodb://127.0.0.1:27017/bakery_menu`
- **Atlas**: create a free cluster → Database Access (create a user) → Network Access (allow your IP) → Connect → copy the SRV connection string into `MONGO_URI`

### 5. Creating the first admin
Handled by `npm run seed` in `server/`. To create additional admins later, either add a small script that calls `Admin.create({...})`, or temporarily open a POST route (remove it once used) — there's no public admin-signup endpoint by design.

To wipe all data: `npm run seed:destroy`.

### 6. Generating and testing the QR code
1. Log in to `/admin/login`
2. Go to **QR Code** in the sidebar — it's generated automatically on first load, pointing at `<CLIENT_URL>/menu/<restaurantId>`
3. Click **Download QR** to save the PNG, or **Copy Link** to share the URL directly
4. Scan it with a phone camera to confirm it opens the public menu (not the admin dashboard)

### 7. Deployment
- **Backend**: deploy `server/` to Render, Railway, or a VM. Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your deployed frontend URL) as environment variables.
- **Frontend**: deploy `client/` to Vercel or Netlify. Set `VITE_API_URL` to your deployed backend's `/api` URL, run `npm run build`, and deploy the `dist/` folder.
- After deploying, regenerate the QR code from the admin dashboard so it encodes your **production** menu URL (it's built from `CLIENT_URL` on the backend at generation time).
- Never commit `.env` files — only `.env.example` is checked in.

## Notes
- The public menu (`/menu/:restaurantId`) and item detail page require no login.
- Availability changes made by the admin (Menu Items page, or the quick-toggle badge) reflect immediately on the public menu on next load/poll.
- The chatbot uses simple keyword matching against your active `ChatbotQuestion` entries — no external AI API — and falls back to: *"Sorry, I don't have an answer for that yet. Please select one of the available questions."*
