const router = require("express").Router();
const Expense = require("../models/Expense");
const { protect, admin } = require("../middleware/auth");

// Add Expense
router.post("/", protect, async (req, res) => {
  try {
    const { title, amount, category, type, date } = req.body;
    const exp = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      category,
      type: type || 'expense',
      date
    });
    res.status(201).json(exp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all expenses for logged in user
router.get("/", protect, async (req, res) => {
  try {
    const data = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete specific expense (User can delete own, Admin can delete any)
router.delete("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (expense.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: "Not authorized to delete this expense" });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ALL expenses (Admin only)
router.get("/all", protect, admin, async (req, res) => {
  try {
    const data = await Expense.find().populate('userId', 'name email').sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
