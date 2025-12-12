import express from 'express';
import auth from '../middleware/auth.js';
import Expense from '../models/Expense.js';

const router = express.Router();

// console.log("expenseRoutes Module Loaded.");

// test login
router.get("/test", auth, (req,res) => {
    
   // console.log("GET /api/expenses/test hit");
    res.json({
        message: "You Are Logged In.",
        userId: req.user.id
    });
});

// create Expenses
// create Expenses
router.post("/", auth, async (req, res) => {
  try {
    console.log("POST /api/expenses body:", req.body);
    console.log("POST /api/expenses user:", req.user);

    // destructure from req.body (ensures title is defined even if missing)
    const { title, amount, category, date, note } = req.body;

    // Basic required checks
    if (amount === undefined || !category || !date) {
      return res.status(400).json({ message: "Amount, category and date are required." });
    }

    // sanitize / convert types
    const amt = Number(amount);
    if (!Number.isFinite(amt)) {
      return res.status(400).json({ message: "Amount must be a number." });
    }

    const expenseDate = new Date(date);
    if (isNaN(expenseDate.getTime())) {
      return res.status(400).json({ message: "Date is invalid." });
    }

    // fallback title if not provided
    const finalTitle =
      title && String(title).trim().length
        ? String(title).trim()
        : note && String(note).trim().length
        ? String(note).trim().slice(0, 60)
        : `${category} expense`;

    const expense = await Expense.create({
      user: req.user && req.user.id ? req.user.id : null,
      title: finalTitle,
      amount: amt,
      category,
      date: expenseDate,
      note,
    });

    console.log("Created expense id:", expense._id);
    return res.status(201).json(expense);
  } catch (err) {
    // use the same parameter name (err) here
    console.error("Create Expense Error:", err);

    // Friendly validation errors if it's a Mongoose ValidationError
    if (err && err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors: messages });
    }

    return res.status(500).json({ message: "Server Error." });
  }
});


// list expenses for userId.

router.get("/", auth, async (req,res) => {
    try {
        const expenses = await Expense.find({user: req.user.id}).sort({date: -1});
        res.json(expenses);
    }catch(error) {
        console.error("List Expense Error", error);
        res.status(500).json({message: "Server Error."});
    }
});

// delete expenses
router.delete("/:id", auth, async (req,res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if(!expense) {
            return res.status(404).json({message: "Expense Not Found !"});
        }

        res.json({message: "Expense Deleted."});
    }catch(err) {
        res.status(500).json({message: "Server Error."});
    }
});


// update expense
router.put("/:id", auth, async (req,res) => {
    try{
        const {id} = req.params;
        const update = req.body || {};

        // Allowed fields [prevent updating user, timestamps.]
        const allowed = ["title","amount","category","date","note"];
        const payload = {};
        for(const key of allowed) {
            if(update[key] !== undefined) payload[key] = update[key];
        }

        // Convert types if present
        if (payload.amount !== undefined) payload.amount = Number(payload.amount);
        if (payload.date !== undefined) payload.date = new Date(payload.date);

        const expense = await Expense.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { $set: payload },
            {new: true, runValidators: true}
        );

        if(!expense) {
            return res.status(404).json({message: "Expense Not Found OR Not Owned By You."});
        }

        res.json(expense);

    }catch(err) {
        console.error("Update expense Error", err);

        if(err && err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({message: "Verification Failed", error: messages});
        }

        return res.status(500).json({message: "Server Error."});
    }
});


export default router;