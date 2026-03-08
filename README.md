🍦 Arctic Bliss - Premium Ice Cream Platform
A modern, full-stack web application for a luxury ice cream brand, built with React.js, Node.js, Express, and MongoDB. Features real authentication, live product data, order management, reviews, complaints, and a full admin dashboard.

✨ Features

Responsive Modern UI — Built with Tailwind CSS and Framer Motion for smooth animations and a premium feel.
Live Product Catalog — Browse and search flavors fetched live from MongoDB, with category filters.
Real Authentication — JWT-based login/signup with bcrypt password hashing and protected routes.
Dynamic Cart System — Add/remove items with quantity tracking and instant toast notifications.
Full Checkout Flow — Shipping form with validation + Card, UPI, and Cash on Delivery support.
Free Delivery Logic — Automatically applied for orders above $20.
Order Tracking — Track any order by ID with a live visual progress timeline.
Order History — Logged-in users can view all their past orders with status badges.
Reviews System — Submit star ratings and comments on any flavor, with guest review support.
Complaints Portal — File complaints by type (wrong order, quality, delivery, billing), track resolution and admin responses.
Contact Form — Messages are saved to the database and manageable from the admin panel.
Loyalty Points — Users earn 1 point per $1 spent, tracked on their account.
Admin Dashboard — Full management panel for orders, flavors, users, reviews, complaints, and messages with live stats.


🛠️ Built With
Frontend

React.js 19
Tailwind CSS
Framer Motion
Lucide React
React Router DOM
React Hot Toast

Backend

Node.js + Express
MongoDB + Mongoose
JSON Web Tokens (JWT)
Bcrypt.js
Express Validator


📁 Project Structure
arctic-bliss/
├── arctic-bliss/          # React + Vite frontend
│   └── src/
│       ├── components/    # Navbar, Cart, Footer
│       ├── context/       # AuthContext (global user state)
│       ├── pages/         # All page components
│       └── services/      # API service layer
└── backend/               # Node.js + Express API
    ├── models/            # Mongoose schemas
    ├── routes/            # API route handlers
    └── middleware/        # JWT auth middleware

💻 Local Setup
Prerequisites

Node.js v18+
MongoDB (local or MongoDB Atlas)

1. Clone the repo
bashgit clone https://github.com/your-username/Arctic-Bliss.git
cd Arctic-Bliss
2. Setup the Backend
bashcd backend
cp .env.example .env
npm install
node seed.js
npm run dev

The seed script creates the admin account and populates all 21 flavors.

3. Setup the Frontend
bashcd arctic-bliss
cp .env.example .env
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 🔑 Default Admin Credentials
```
Email:    admin@arcticbliss.com
Password: admin123

🔌 API Overview
ResourceEndpointsAuthRegister, Login, Profile, Change PasswordFlavorsList, Detail, Create, Update, Delete (Admin)OrdersPlace, My Orders, Track by ID, Update Status (Admin)ReviewsGet by Flavor, Submit, Delete (Admin)ComplaintsSubmit, My Complaints, Update/Respond (Admin)ContactSend Message, View Messages (Admin)AdminDashboard Stats, User Management

📸 Pages

/ — Hero landing page
/flavors — Product catalog with search and category filter
/flavor/:slug — Flavor detail with reviews
/checkout — Checkout with payment selection
/orders — Order history (requires login)
/track/:orderId — Live order tracker (public)
/complaints — File and track complaints
/contact — Contact form
/admin — Admin dashboard (requires admin login)



2. Setup the Backend
bashcd backend
cp .env.example .env
npm install
node seed.js
npm run dev



3. Setup the Frontend
bashcd arctic-bliss
cp .env.example .env
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 🔑 Default Admin Credentials
```
Email:    admin@arcticbliss.com
Password: admin123


📄 License
MIT — feel free to use this project for learning or as a base for your own work.

Handcrafted with 💖 in Kochi
