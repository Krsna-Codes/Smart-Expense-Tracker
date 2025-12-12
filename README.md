# Smart-Expense-Tracker

A clean and user-friendly expense tracking application built with the MERN stack (MongoDB, Express, React, Node.js).
Users can securely log in, add expenses, view detailed notes, edit entries, and delete them—all inside a modern UI.

🚀 Features

✔️ JWT-based Login & Registration
✔️ Add expenses with: Title, Category, Amount, Date & Notes
✔️ Edit & Delete individual expenses
✔️ Fully private — each user sees only their own expenses
✔️ Built with reusable, modern React components
✔️ Secure backend with Mongoose models & validation

🗂️ Project Structure

Smart-Expense-Tracker/
│
├── backend/              # Node.js + Express + MongoDB API
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── .env (ignored)
│   └── package.json
│
└── frontend/             # React client (Vite)
    ├── src/components/
    ├── src/pages/
    ├── src/api.js
    ├── .env (ignored)
    └── package.json

⚙️ Tech Stack

Frontend: React, Vite, TailwindCSS
Backend: Node.js, Express.js
Database: MongoDB (Mongoose ODM)
Auth: JWT (JSON Web Tokens)
HTTP Client: Axios

🔧 Setup Instructions

1. Clone the repository
git clone https://github.com/YOUR_USERNAME/Smart-Expense-Tracker.git
cd Smart-Expense-Tracker

2. Setup Backend
cd backend
npm install

-> Create a file named .env inside /backend:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_jwt_secret
PORT=5000

-> Run the backend:
npm run dev

3. Setup Frontend
cd ../frontend
npm install
npm run dev


Frontend will typically runs at:
👉 http://localhost:5173

Backend runs at:
👉 http://localhost:5000

API Endpoints Summary
Auth (authorization process)

POST	/api/auth/register	 Register a new user
POST	/api/auth/login	     Login + receive JWT

Expenses

GET	    /api/expenses	      Fetch all user expenses
POST    /api/expenses	      Create a new expense
PUT	    /api/expenses/:id	  Update an expense
DELETE	/api/expenses/:id	  Delete an expense

