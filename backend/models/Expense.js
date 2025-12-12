import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema (
    {
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: false,
        },
        amount: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        },
        note : {
            type: String
        }
    },
    { timpstamps: true }
);

export default mongoose.model("Expense", expenseSchema);