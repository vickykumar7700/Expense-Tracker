const router = require("express").Router();
const Income = require("../models/Income");
const { protect, admin } = require("../middleware/auth");

// Add Income
router.post("/", protect, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const inc = await Income.create({
      userId: req.user.id,
      title,
      amount,
      category,
      date
    });
    res.status(201).json(inc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all incomes for logged in user
router.get("/", protect, async (req, res) => {
  try {
    const data = await Income.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete specific income
router.delete("/:id", protect, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ message: "Income not found" });

    if (income.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: "Not authorized to delete this income" });
    }

    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ALL incomes (Admin only)
router.get("/all", protect, admin, async (req, res) => {
  try {
    const data = await Income.find().populate('userId', 'name email').sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
