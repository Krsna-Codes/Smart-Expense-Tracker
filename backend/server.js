import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

dotenv.config();

// -----> Enable JSON Parsing
const app = express();
app.use(express.json())

// friendly JSON parse error handler
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    // body-parser / express.json parse error
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }
  next(err);
});

// -----> Enable CORS
app.use(cors());

// authRoutes.js
app.use("/api/auth", authRoutes);

// expenseRoutes.js
app.use("/api/expenses", expenseRoutes);

// -----> connect to MongoDB
connectDB();

// -----> Starting server at PORT = 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
});

